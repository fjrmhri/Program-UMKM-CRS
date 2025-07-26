import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { ref, onValue, remove } from "firebase/database";
import FormModalMSE from "./FormModalBook";
import DetailModalBook from "./DetailModalBook";
import { useAuth } from "../../context/AuthContext";

export default function DashboardBook({ onAddForm }) {
  const [datasets, setDatasets] = useState([]);
  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(null);
  const { user, logout } = useAuth();
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoadingData(true);
    const q = ref(db, `bookkeeping/${user.uid}`);
    const unsubscribe = onValue(
      q,
      (snap) => {
        const data = snap.val();
        const arr = Object.entries(data || {})
          .map(([id, val]) => ({ id, ...val }))
          .sort((a, b) => b.createdAt - a.createdAt);
        setDatasets(arr);
        setLoadingData(false);
      },
      (error) => {
        console.error("Error fetching data:", error);
        setLoadingData(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleEdit = (data) => {
    setEditData(data);
  };

  const handleView = (data) => {
    setViewData(data);
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin hapus data ini?")) {
      remove(ref(db, `bookkeeping/${user.uid}/${id}`));
    }
  };

  const formatCurrency = (value) => {
    if (!value) return "-";
    const number = parseFloat(value);
    return number.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <>
      <div className="p-4 bg-white rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="w-full sm:w-auto flex-center flex-col">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 justify-center text-center">
              Pembukuan UMKM
            </h2>
            <p className="text-gray-600 text-sm justify-center text-center mt-1">
              Program Corporate Social Responsibility - Pestate cerenti
            </p>
          </div>

          <div className="w-full sm:w-auto">
            <button
              onClick={onAddForm}
              className="w-full sm:w-auto bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition duration-200 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              + Input Data Baru
            </button>
          </div>
        </div>

        <div className="flex justify-end mb-4">
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm px-3 py-1.5 rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>

        {loadingData ? (
          <div className="flex justify-center items-center py-10">
            <svg
              className="animate-spin h-8 w-8 text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="ml-3 text-gray-600">Memuat data...</p>
          </div>
        ) : datasets.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p className="text-lg mb-2">
              Belum ada data monitoring yang tersedia.
            </p>
            <p className="text-sm">
              Klik "Input Data Baru" untuk mulai menambahkan data.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-centar text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Omset / Penjualan per Bulan
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {datasets.map((d) => (
                  <tr key={d.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(d.meta.tanggal).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatCurrency(
                        d.monitoring.find(
                          (mon) => mon.uraian === "Omset / penjualan per bulan"
                        )?.items[0]?.hasil
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(d)}
                          className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-blue-200 transition"
                        >
                          Detail
                        </button>
                        <button
                          onClick={() => handleEdit(d)}
                          className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-200 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(d.id)}
                          className="bg-red-100 text-red-600 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-red-200 transition"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editData && (
        <FormModalMSE
          existingData={editData}
          onClose={() => setEditData(null)}
        />
      )}

      {viewData && (
        <DetailModalBook data={viewData} onClose={() => setViewData(null)} />
      )}
    </>
  );
}
