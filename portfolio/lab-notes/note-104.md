# Transformer Attention Deep Dive (NOTE-104)

**Type:** Research Note  
**Read Time:** 5 minutes  
**Created:** 2023-10-12

## Overview

A technical breakdown of multi-head attention implementation, focusing on common pitfalls and "What Didn't Work" during custom layer development.

## The Standard Formula

$$
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V
$$

Simple enough on paper. In practice, several edge cases caused issues.

## What Didn't Work

### 1. Incorrect Dimension Ordering

**Problem:** PyTorch expects `(batch, seq, features)` but I was passing `(seq, batch, features)`.

**Symptom:** Silently ran with garbage output. Loss plateaued at 4.2.

**Fix:**
```python
# Wrong
x = x.transpose(0, 1)  # Only once
# Right  
x = x.permute(1, 0, 2)  # Explicit permutation
```

### 2. Missing Scaling Factor

**Problem:** Forgot the `sqrt(d_k)` scaling, causing softmax saturation.

**Symptom:** Attention weights were either 0 or 1, no middle ground.

**Fix:**
```python
scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.d_k)
```

### 3. Mask Broadcasting Issues

**Problem:** Attention mask shape `(batch, 1, seq, seq)` didn't broadcast correctly with scores `(batch, heads, seq, seq)`.

**Symptom:** `RuntimeError: The size of tensor a (8) must match the size of tensor b (512)`

**Fix:**
```python
# Ensure mask has correct dimensions
mask = mask.unsqueeze(1).unsqueeze(2)  # (batch, 1, 1, seq)
scores = scores.masked_fill(mask == 0, -1e9)
```

## Key Insights

1. **Always print shapes** during debugging. Attention bugs are almost always dimension mismatches.

2. **Use `einops`** for complex tensor operations - much clearer than nested transposes.

3. **Gradient checking** early catches numerical issues from missing scaling.

## Useful Resources

- [Attention Is All You Need](https://arxiv.org/abs/1706.03762) - Original paper
- [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/) - Visual guide
- [Annotated Transformer](https://nlp.seas.harvard.edu/2018/04/03/attention.html) - Code walkthrough

---

*Last updated: 2023-10-15*
