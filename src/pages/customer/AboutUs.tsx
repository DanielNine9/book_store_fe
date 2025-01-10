import React from 'react'

type Props = {}

const AboutUs = (props: Props) => {
  return (
    <div>
         <div id="about" className="bg-white py-16">
              <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900">Về Chúng Tôi</h2>
                  <div className="mt-2 h-1 w-20 bg-indigo-600 mx-auto"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div>
                    <img
                      src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                      alt="Về chúng tôi"
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">Sứ mệnh của chúng tôi</h3>
                    <p className="text-gray-600 mb-6">
                      BookHaven được thành lập với sứ mệnh mang đến cho độc giả những cuốn sách chất lượng nhất với giá cả hợp lý nhất. Chúng tôi tin rằng mỗi cuốn sách là một chuyến phiêu lưu mới, một cơ hội học hỏi và phát triển.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-lg mb-2">10K+</h4>
                        <p className="text-gray-600">Đầu sách</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-lg mb-2">50K+</h4>
                        <p className="text-gray-600">Khách hàng</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-lg mb-2">100K+</h4>
                        <p className="text-gray-600">Đơn hàng</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-lg mb-2">4.8/5</h4>
                        <p className="text-gray-600">Đánh giá</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
    </div>
  )
}

export default AboutUs