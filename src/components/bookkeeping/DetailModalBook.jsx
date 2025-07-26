import React from "react";

export default function DetailModalBook({ data, onClose }) {
  const { meta, monitoring = [], comparison } = data;

  const formatHasil = (val) => {
    if (!val) return "";
    const number = parseFloat(val);
    return !isNaN(number) ? number.toLocaleString("id-ID") : val.toString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-start pt-10 overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl space-y-4 mx-2">
        <h2 className="text-2xl font-bold text-center">
          Detail Monitoring MSE
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {[
            ["Nama", meta.nama],
            ["Usaha", meta.usaha],
            ["HP/WA", meta.hp],
            ["Desa", meta.desa],
            ["Kota/Kabupaten", meta.kota],
            ["Estate", meta.estate],
            ["CDO", meta.cdo],
            ["Tanggal Monitoring", meta.tanggal],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between">
              <b>{label}:</b> <span>{val || ""}</span> {}
            </div>
          ))}
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full text-xs border rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Uraian</th>
                <th className="p-2">Item</th>
                <th className="p-2">Hasil Monitoring</th>
                {comparison && <th className="p-2">Hasil Perbandingan</th>}
              </tr>
            </thead>
            <tbody>
              {monitoring.map((row, i) =>
                row.uraian === "Omset / penjualan per bulan" ? (
                  <tr key={i} className="border-t border-b">
                    <td className="p-2 border-r">{row.uraian}</td>
                    <td className="p-2 border-r">Rp</td>
                    <td className="p-2 border-r text-right">
                      {formatHasil(row.items[0]?.hasil)}
                    </td>
                    {comparison && (
                      <td className="p-2 text-right">
                        {formatHasil(comparison[i]?.items[0]?.hasil)}
                      </td>
                    )}
                  </tr>
                ) : (
                  row.items.map((item, idx) => (
                    <tr key={`${i}-${idx}`} className="border-t border-b">
                      {idx === 0 ? (
                        <td
                          className="p-2 border-r align-top"
                          rowSpan={row.items.length}
                          style={{ verticalAlign: "top" }}
                        >
                          {row.uraian}
                        </td>
                      ) : null}
                      <td className="p-2 border-r">{item.nama || ""}</td>
                      {}
                      <td className="p-2 border-r text-right">
                        {formatHasil(item.hasil)}
                      </td>
                      {comparison && (
                        <td className="p-2 text-right">
                          {formatHasil(comparison[i]?.items[idx]?.hasil)}
                        </td>
                      )}
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="text-gray-600 hover:underline w-full sm:w-auto text-center"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
