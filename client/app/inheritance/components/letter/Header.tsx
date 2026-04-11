import { ChevronLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  return (
    <div className="w-full flex items-center justify-between px-4 py-4 border-b border-gray-100">
      <button
        type="button"
        onClick={() => router.back()}
        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" strokeWidth={2} />
      </button>
      <h1 className="text-base font-semibold text-gray-900">상속 편지</h1>
      <button
        type="button"
        onClick={() => router.back()}
        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
      >
        <X className="w-6 h-6 text-gray-700" strokeWidth={2} />
      </button>
    </div>
  );
}
