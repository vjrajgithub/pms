<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        // Allow managers, super admin, and users with view permission
        if (!($user->isSuperAdmin() || $user->isAdmin() || $user->isManager())) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $parentId = $request->query('parent_id');
        $query = Category::query()->orderBy('order')->orderBy('name');
        if ($parentId !== null) {
            $query->where('parent_id', $parentId);
        } else {
            $query->whereNull('parent_id');
        }

        return response()->json($query->get());
    }

    public function tree()
    {
        $user = auth()->user();
        // Allow managers, super admin, and users with view permission
        if (!($user->isSuperAdmin() || $user->isAdmin() || $user->isManager())) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $tree = Category::with('childrenRecursive')->whereNull('parent_id')->orderBy('order')->orderBy('name')->get();
        return response()->json($tree);
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        // Check permission using new RBAC system
        if (!($user->isSuperAdmin() || $user->isAdmin() || $user->isManager())) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:categories,id',
            'order' => 'sometimes|integer|min:0',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->filled('parent_id')) {
            $parent = Category::findOrFail($request->parent_id);
            $depth = $this->computeDepth($parent) + 1;
            if ($depth > 6) {
                return response()->json(['error' => 'Maximum depth of 6 exceeded'], 422);
            }
        }

        $category = Category::create([
            'name' => $request->name,
            'parent_id' => $request->parent_id,
            'order' => $request->order ?? 0,
            'is_active' => $request->is_active ?? true,
        ]);

        return response()->json(['message' => 'Category created successfully', 'category' => $category], 201);
    }

    public function update(Request $request, $id)
    {
        $user = auth()->user();
        if (!($user->isSuperAdmin() || $user->isAdmin() || $user->isManager())) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $category = Category::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'parent_id' => 'sometimes|nullable|exists:categories,id',
            'order' => 'sometimes|integer|min:0',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->has('parent_id')) {
            $newParentId = $request->parent_id;
            if ($newParentId == $category->id) {
                return response()->json(['error' => 'A category cannot be its own parent'], 422);
            }
            if ($newParentId) {
                $parent = Category::findOrFail($newParentId);
                if ($this->isDescendant($parent, $category->id)) {
                    return response()->json(['error' => 'Cannot assign a descendant as parent'], 422);
                }
                $depth = $this->computeDepth($parent) + 1;
                if ($depth > 6) {
                    return response()->json(['error' => 'Maximum depth of 6 exceeded'], 422);
                }
                $subtreeDepth = $this->computeSubtreeDepth($category);
                if (($this->computeDepth($parent) + $subtreeDepth) > 6) {
                    return response()->json(['error' => 'Move would exceed maximum depth of 6'], 422);
                }
            }
        }

        $update = $request->only(['name', 'parent_id', 'order', 'is_active']);
        $category->update($update);
        return response()->json(['message' => 'Category updated successfully', 'category' => $category]);
    }

    public function destroy($id)
    {
        $user = auth()->user();
        if (!($user->isSuperAdmin() || $user->isAdmin() || $user->isManager())) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $category = Category::findOrFail($id);
        $category->delete();
        return response()->json(['message' => 'Category deleted successfully']);
    }

    private function computeDepth(Category $category): int
    {
        $depth = 1;
        $cur = $category;
        while ($cur->parent_id) {
            $cur = Category::find($cur->parent_id);
            if (!$cur) break;
            $depth++;
            if ($depth > 20) break;
        }
        return $depth;
    }

    private function isDescendant(Category $candidateParent, int $targetId): bool
    {
        $cur = $candidateParent;
        while ($cur) {
            if ($cur->id == $targetId) return true;
            if (!$cur->parent_id) return false;
            $cur = Category::find($cur->parent_id);
        }
        return false;
    }

    private function computeSubtreeDepth(Category $node): int
    {
        $max = 1;
        foreach ($node->children as $child) {
            $max = max($max, 1 + $this->computeSubtreeDepth($child));
        }
        return $max;
    }
}
