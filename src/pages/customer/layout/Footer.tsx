import { BookOpen } from 'lucide-react'
import React from 'react'

const Footer = () => {
  return (
    <div>
        <footer className="bg-gray-900 text-white">
<div className="max-w-7xl mx-auto px-4 py-12">
  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
    <div>
      <div className="flex items-center mb-4">
        <BookOpen className="h-8 w-8 text-indigo-400" />
        <span className="ml-2 text-xl font-bold">BookHaven</span>
      </div>
      <p className="text-gray-400">
        Đồng hành cùng bạn trên hành trình khám phá tri thức
      </p>
    </div>
    <div>
      <h4 className="text-lg font-semibold mb-4">Danh mục</h4>
      <ul className="space-y-2">
        <li><a href="#" className="text-gray-400 hover:text-white">Văn học</a></li>
        <li><a href="#" className="text-gray-400 hover:text-white">Kinh tế</a></li>
        <li><a href="#" className="text-gray-400 hover:text-white">Tâm lý học</a></li>
        <li><a href="#" className="text-gray-400 hover:text-white">Lifestyle</a></li>
      </ul>
    </div>
    <div>
      <h4 className="text-lg font-semibold mb-4">Hỗ trợ</h4>
      <ul className="space-y-2">
        <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
        <li><a href="#" className="text-gray-400 hover:text-white">Vận chuyển</a></li>
        <li><a href="#" className="text-gray-400 hover:text-white">Đổi trả</a></li>
        <li><a href="#" className="text-gray-400 hover:text-white">Thanh toán</a></li>
      </ul>
    </div>
    <div>
      <h4 className="text-lg font-semibold mb-4">Đăng ký nhận tin</h4>
      <p className="text-gray-400 mb-4">
        Nhận thông tin về sách mới và khuyến mãi
      </p>
      <div className="flex">
        <input
          type="email"
          placeholder="Email của bạn"
          className="flex-1 px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700">
          Đăng ký
        </button>
      </div>
    </div>
  </div>
  <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
    <p>&copy; 2024 BookHaven. Tất cả quyền được bảo lưu.</p>
  </div>
</div>
</footer>
    </div>
  )
}

export default Footer