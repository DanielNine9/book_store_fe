import React from 'react';

// Hàm để lấy giá trị từ một đường dẫn lồng nhau
const getValueByPath = (obj: any, path: string) => {
  const keys = path.split('.');  // Chia chuỗi đường dẫn thành các phần
  let value = obj;
  
  for (let key of keys) {
    if (value) {
      value = value[key]; // Truy cập theo từng phần tử trong đường dẫn
    } else {
      return undefined; // Trả về undefined nếu không tìm thấy
    }
  }

  return value; // Trả về giá trị cuối cùng
};

interface Column {
  label: string;
  field: string;
  render?: (data: any) => React.ReactNode; // Hàm render tùy chỉnh
}

interface TableProps {
  data: any[]; // Dữ liệu tổng thể
  columns: Column[]; // Các cột tùy chỉnh
  loading: boolean;
  error: string | null;
}

export const Table: React.FC<TableProps> = ({ data, columns, loading, error }) => {
  return (
    <div className="overflow-x-auto">
      {/* Thêm max-height và overflow-y-auto để hiển thị scroll khi quá chiều cao cố định */}
      <div className="max-h-96 overflow-y-auto"> {/* max-h-96 là chiều cao cố định, có thể điều chỉnh */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns?.map((column) => (
                <th
                  key={column.field}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                  Đang tải...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-red-500">
                  {/* {error} */}
                  Vui long reload lại.
                </td>
              </tr>
            ) : (
              data?.map((item, index) => (
                <tr key={item.ID}>
                  {columns?.map((column) => (
                    <td key={column.field} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {/* Nếu có hàm render thì dùng nó, nếu không thì lấy theo trường 'field' */}
                      {column.render
                        ? column.render(item)
                        : getValueByPath(item, column.field) // Lấy giá trị từ đường dẫn
                      }
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
