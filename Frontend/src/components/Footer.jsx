export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="text-indigo-600 font-bold text-lg">ExpertBook</div>
        <p className="text-gray-400 text-sm">© 2026 ExpertBook. All rights reserved.</p>
        <div className="flex gap-4 text-sm text-gray-500">
          <span className="hover:text-indigo-600 cursor-pointer transition">Privacy Policy</span>
          <span className="hover:text-indigo-600 cursor-pointer transition">Terms of Service</span>
          <span className="hover:text-indigo-600 cursor-pointer transition">Contact</span>
        </div>
      </div>
    </footer>
  );
}