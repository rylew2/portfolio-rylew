# Pre: V, L, R ==> 10 , 5 , 1, 6, 15
# In: L, V, R ==> 1, 5 ,6, 10, 15

# [1,5,6,10,15]


class Node:
  def __init__(self, val, left=None, right=None):
    self.val= val
    self.left = left
    self.right = right

# tree = [] # n space
count = 0
def getNthSmallestNode(root, n):
  if not root:
    return None
  
  global count = 0 
  def in_order(rt): # n time , n space
    if not rt:
      return
    in_order(rt.left)
    count += 1
    if count == n:
      ans = rt
    in_order(rt.right)
 
  ans = None  
  in_order(root)
  return ans
  # return tree[n-1] # array method - n space




my_root = Node(None)
print(getNthSmallestNode(my_root, 1))


my_root = Node(10)
my_root.left = Node(5)
my_root.left.left = Node(1)
my_root.left.right = Node(6)
my_root.right = Node(15)
print(getNthSmallestNode(my_root, 1))
print(getNthSmallestNode(my_root, 2)) 
print(getNthSmallestNode(my_root, 3))
print(getNthSmallestNode(my_root, 4))
print(getNthSmallestNode(my_root, 5))