import React from 'react'

type Props = {}

const HeroSection = (props: Props) => {
  return (
    <div>
        <div id="home" className="relative">
                      <div className="h-[500px] w-full bg-cover bg-center" style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80")'
                      }}>
                        <div className="absolute inset-0 bg-black bg-opacity-50">
                          <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
                            <div className="text-white">
                              <h1 className="text-5xl font-bold mb-4">Khám phá thế giới qua từng trang sách</h1>
                              <p className="text-xl mb-8">Hàng ngàn đầu sách chất lượng đang chờ đón bạn</p>
                              <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700">
                                Khám phá ngay
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
    </div>
  )
}

export default HeroSection