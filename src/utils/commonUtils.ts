/**
 * Định dạng giá trị số với toLocaleString
 * @param value Giá trị đầu vào, có thể là số hoặc undefined/null
 * @param defaultValue Giá trị mặc định nếu value là undefined/null
 * @param locale Locale để định dạng, mặc định là 'vi-VN'
 * @param options Tùy chọn định dạng số
 * @returns Chuỗi định dạng số
 */
export const formatCurrency = (
    value: number | undefined | null,
    defaultValue: number = 0,
    locale: string = 'vi-VN',
    options: Intl.NumberFormatOptions = {}
  ): string => {
    return (value ?? defaultValue).toLocaleString(locale, options);
  };
  
  /**
   * Xử lý chuỗi, trả về giá trị mặc định nếu undefined/null
   * @param value Giá trị chuỗi đầu vào
   * @param defaultValue Giá trị mặc định nếu value là undefined/null
   * @returns Chuỗi sau xử lý
   */
  export const safeString = (value: string | undefined | null, defaultValue: string = 'Không xác định'): string => {
    return value ?? defaultValue;
  };
  