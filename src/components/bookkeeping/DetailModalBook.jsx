import React from "react";

export default function DetailModalBook({ data, onClose }) {
  const { meta = {}, monitoring = [], comparison } = data;

  const formatHasil = (val) => {
    if (val === null || val === undefined || val === "") return "-";
    const number = Number(val);
    return Number.isNaN(number)
      ? val.toString()
      : number.toLocaleString("id-ID");
  };

  const metaEntries = [
    ["Nama", meta.nama],
    ["Usaha", meta.usaha],
    ["HP/WA", meta.hp],
    ["Desa", meta.desa],
    ["Kota/Kabupaten", meta.kota],
    ["Estate", meta.estate],
    ["CDO", meta.cdo],
    ["Tanggal Monitoring", meta.tanggal],
    ["Klasifikasi", meta.klasifikasi],
  ].filter(([_, value]) => value);

  const showComparison = Boolean(comparison);

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 z-50 flex justify-center items-start pt-10 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full sm:max-w-xl md:max-w-3xl lg:max-w-4xl space-y-6 mx-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Detail Monitoring MSE
            </h2>
            {meta.tanggal && (
              <p className="text-sm text-slate-500">
                Tanggal pengisian: {meta.tanggal}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-rose-500 text-lg"
            aria-label="Tutup detail"
          >
            ×
          </button>
        </div>

        {metaEntries.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-slate-50 rounded-xl p-4">
            {metaEntries.map(([label, val]) => (
              <div key={label}>
                <p className="text-slate-500 text-xs uppercase tracking-wide">
                  {label}
                </p>
                <p className="font-semibold text-slate-900">{val}</p>
              </div>
            ))}
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-3 text-left font-semibold">Uraian</th>
                <th className="p-3 text-left font-semibold">Item</th>
                <th className="p-3 text-right font-semibold">Hasil Monitoring</th>
                {showComparison && (
                  <th className="p-3 text-right font-semibold">
                    Hasil Perbandingan
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {monitoring.map((row, i) =>
                row.uraian === "Omset / penjualan per bulan" ? (
                  <tr key={row.uraian} className="border-t border-slate-100">
                    <td className="p-3 font-semibold text-slate-800">
                      {row.uraian}
                    </td>
                    <td className="p-3 text-slate-600">Rp</td>
                    <td className="p-3 text-right font-semibold text-slate-900">
                      {formatHasil(row.items[0]?.hasil)}
                    </td>
                    {showComparison && (
                      <td className="p-3 text-right text-slate-600">
                        {formatHasil(comparison[i]?.items[0]?.hasil)}
                      </td>
                    )}
                  </tr>
                ) : (
                  row.items.map((item, idx) => (
                    <tr key={`${row.uraian}-${idx}`} className="border-t border-slate-100">
                      {idx === 0 && (
                        <td
                          className="p-3 font-semibold text-slate-800 align-top"
                          rowSpan={row.items.length}
                        >
                          {row.uraian}
                        </td>
                      )}
                      <td className="p-3 text-slate-600">
                        {item.nama || "-"}
                      </td>
                      <td className="p-3 text-right font-semibold text-slate-900">
                        {formatHasil(item.hasil)}
                      </td>
                      {showComparison && (
                        <td className="p-3 text-right text-slate-600">
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

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
