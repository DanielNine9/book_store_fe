import React from 'react'
import { BookIcon, BookOpen, Coffee, Facebook, Heart, Instagram, Mail, MapPin, Phone, TrendingUp, Twitter } from 'lucide-react';


type Props = {}

const ContactUs = (props: Props) => {
  return (
    <div>

<div id="contact" className="bg-white py-16">
              <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900">Liên Hệ</h2>
                  <div className="mt-2 h-1 w-20 bg-indigo-600 mx-auto"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-xl font-semibold mb-6">Gửi tin nhắn cho chúng tôi</h3>
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tin nhắn</label>
                        <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" rows={4}></textarea>
                      </div>
                      <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 w-full">
                        Gửi tin nhắn
                      </button>
                    </form>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-6">Thông tin liên hệ</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <MapPin className="h-6 w-6 text-indigo-600 mt-1" />
                        <div className="ml-4">
                          <h4 className="font-medium">Địa chỉ</h4>
                          <p className="text-gray-600">123 Đường Sách, Quận 1, TP.HCM</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Phone className="h-6 w-6 text-indigo-600 mt-1" />
                        <div className="ml-4">
                          <h4 className="font-medium">Điện thoại</h4>
                          <p className="text-gray-600">1900 1234</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Mail className="h-6 w-6 text-indigo-600 mt-1" />
                        <div className="ml-4">
                          <h4 className="font-medium">Email</h4>
                          <p className="text-gray-600">contact@bookhaven.com</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8">
                      <h4 className="font-medium mb-4">Theo dõi chúng tôi</h4>
                      <div className="flex space-x-4">
                        <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                          <Facebook className="h-5 w-5 text-gray-600" />
                        </a>
                        <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                          <Twitter className="h-5 w-5 text-gray-600" />
                        </a>
                        <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                          <Instagram className="h-5 w-5 text-gray-600" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
    </div>
  )
}

export default ContactUs