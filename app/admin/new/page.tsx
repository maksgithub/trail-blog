"use client";

import AdminGuard from "@/components/AdminGuard";
import PostForm from "@/components/PostForm";

export default function NewPostPage() {
  return (
    <AdminGuard>
      <PostForm />
    </AdminGuard>
  );
}
