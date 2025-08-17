import React, { useEffect, useMemo, useState } from "react";
import { db } from "../../firebase";
import {
  ref as dbRef,
  onValue,
  set,
  remove as dbRemove,
} from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import FormModalMSE from "./FormModalBook";
import DetailModalBook from "./DetailModalBook";
import { useAuth } from "../../context/AuthContext";

import {
  LineChart as RLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import {
  LineChart as LineChartIcon,
  Eye,
  Pencil,
  Trash2,
  LogOut,
  Plus,
  ChevronUp,
  ChevronDown,
  StickyNote,
} from "lucide-react";

// Utility: format Rupiah
const toIDR = (value) => {
  const n = Number(value ?? 0);
  if (Number.isNaN(n)) return "-";
  return n.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });
};

export default function DashboardBook({ onAddForm }) {
  const { user, logout } = useAuth();

  const [datasets, setDatasets] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [sortOrder, setSortOrder] = useState("desc");
  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(null);

  const [showChart, setShowChart] = useState(false);

  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  // ---- Fetch bookkeeping
  useEffect(() => {
    if (!user) return;
    setLoadingData(true);
    const q = dbRef(db, `bookkeeping/${user.uid}`);
    const unsub = onValue(
      q,
      (snap) => {
        const data = snap.val();
        const arr = data
          ? Object.entries(data)
              .map(([id, val]) => ({ id, ...val }))
              .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
          : [];
        setDatasets(arr);
        setLoadingData(false);
      },
      () => setLoadingData(false)
    );
    return () => unsub();
  }, [user]);

  // ---- Fetch notes
  useEffect(() => {
    if (!user) return;
    const notesRef = dbRef(db, `notes/${user.uid}`);
    const unsub = onValue(notesRef, (snap) => {
      const data = snap.val();
      const arr = data
        ? Object.entries(data)
            .map(([key, val]) => ({ ...val, id: key }))
            .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
        : [];
      setNotes(arr);
    });
    return () => unsub();
  }, [user]);

  // ---- Helpers
  const getOmset = (d) =>
    parseFloat(
      d?.monitoring?.find((mon) => mon.uraian === "Omset / penjualan per bulan")
        ?.items?.[0]?.hasil || 0
    );

  const getTotalBiaya = (d) =>
    parseFloat(
      d?.monitoring?.find(
        (mon) => mon.uraian === "Total biaya operasional per bulan"
      )?.items?.[0]?.hasil || 0
    );

  const sortedDatasets = useMemo(() => {
    const copy = [...datasets];
    copy.sort((a, b) =>
      sortOrder === "asc"
        ? getOmset(a) - getOmset(b)
        : getOmset(b) - getOmset(a)
    );
    return copy;
  }, [datasets, sortOrder]);

  const chartData = useMemo(() => {
    return datasets
      .map((d) => ({
        tanggal: d?.meta?.tanggal || "",
        omset: getOmset(d),
      }))
      .sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
  }, [datasets]);

  // ---- KPIs
  const kpi = useMemo(() => {
    const count = datasets.length;
    const totalOmset = datasets.reduce((sum, d) => sum + getOmset(d), 0);
    const totalBiaya = datasets.reduce((sum, d) => sum + getTotalBiaya(d), 0);
    const avgOmset = count ? Math.round(totalOmset / count) : 0;
    const lastMonth =
      chartData.length > 0 ? chartData[chartData.length - 1].omset : 0;
    const prevMonth =
      chartData.length > 1 ? chartData[chartData.length - 2].omset : 0;
    const growth = prevMonth ? ((lastMonth - prevMonth) / prevMonth) * 100 : 0;
    return { count, totalOmset, totalBiaya, avgOmset, growth };
  }, [datasets, chartData]);

  // ---- Actions
  const handleEdit = (data) => setEditData(data);
  const handleView = (data) => setViewData(data);

  const handleDelete = (id) => {
    if (window.confirm("Yakin hapus data ini?")) {
      dbRemove(dbRef(db, `bookkeeping/${user.uid}/${id}`));
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const noteId = uuidv4();
    await set(dbRef(db, `notes/${user.uid}/${noteId}`), {
      id: noteId,
      text: newNote.trim(),
      createdAt: Date.now(),
      checked: false,
    });
    setNewNote("");
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm("Hapus catatan ini?")) {
      await dbRemove(dbRef(db, `notes/${user.uid}/${id}`));
    }
  };

  // ---- UI
  return (
    <>
      <div className="space-y-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left space-y-1">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-800">
              Pembukuan UMKM
            </h2>
            <p className="text-sm text-gray-600">
              Program Corporate Social Responsibility — estate cerenti
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <button
              onClick={onAddForm}
              className="h-10 px-4 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition flex items-center gap-2 justify-center"
            >
              <Plus className="h-4 w-4" /> Input Data Baru
            </button>
            <button
              onClick={() => setShowChart(true)}
              className="h-10 px-4 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition flex items-center gap-2 justify-center"
            >
              <LineChartIcon className="h-4 w-4" /> Grafik
            </button>
            <button
              onClick={logout}
              className="h-10 px-4 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition flex items-center gap-2 justify-center"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow">
            <p className="text-sm text-gray-600">Total Omset</p>
            <p className="text-2xl font-bold text-gray-800">
              {toIDR(kpi.totalOmset)}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <p className="text-sm text-gray-600">Total Biaya Operasional</p>
            <p className="text-2xl font-bold text-gray-800">
              {toIDR(kpi.totalBiaya)}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <p className="text-sm text-gray-600">Rata-rata Omset</p>
            <p className="text-2xl font-bold text-gray-800">
              {toIDR(kpi.avgOmset)}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <p className="text-sm text-gray-600">Perubahan Bulan Terakhir</p>
            <p
              className={`text-2xl font-bold ${
                kpi.growth >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {kpi.growth >= 0 ? "+" : ""}
              {kpi.growth.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Table Data */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          {loadingData ? (
            <div className="flex justify-center items-center py-10 text-gray-600">
              Memuat data...
            </div>
          ) : datasets.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              Belum ada data monitoring. Klik “Input Data Baru” untuk
              menambahkan.
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-center">Tanggal</th>
                  <th className="px-4 py-2 text-center">
                    <button
                      type="button"
                      onClick={() =>
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                      }
                      className="inline-flex items-center gap-1 hover:underline"
                    >
                      Omset{" "}
                      {sortOrder === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {sortedDatasets.map((d) => (
                  <tr key={d.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 text-center">
                      {d?.meta?.tanggal
                        ? new Date(d.meta.tanggal).toLocaleDateString("id-ID")
                        : "-"}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {toIDR(getOmset(d))}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex flex-wrap justify-center gap-2">
                        <button
                          onClick={() => handleEdit(d)}
                          className="h-9 px-6 rounded-lg bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 transition inline-flex items-center gap-1"
                        >
                          <Pencil className="h-4 w-4" /> Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Catatan langsung di dashboard */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
            <StickyNote className="h-5 w-5 text-blue-500" /> Catatan
          </h3>
          <form onSubmit={handleAddNote} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Tulis catatan singkat..."
              maxLength={100}
              className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="h-10 px-4 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition"
            >
              Simpan
            </button>
          </form>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {notes.length === 0 && (
              <p className="text-gray-500 text-sm text-center">
                Belum ada catatan.
              </p>
            )}
            {notes.map((note) => (
              <div
                key={note.id}
                className="flex items-center justify-between bg-gray-50 border rounded px-3 py-2"
              >
                <span>{note.text}</span>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Grafik */}
      {showChart && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative">
            <h3 className="text-lg font-bold text-center mb-4">
              Grafik Perkembangan Omset
            </h3>
            <div className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <RLineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tanggal" />
                  <YAxis tickFormatter={(v) => v.toLocaleString("id-ID")} />
                  <Tooltip formatter={(v) => v.toLocaleString("id-ID")} />
                  <Line
                    type="monotone"
                    dataKey="omset"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot
                  />
                </RLineChart>
              </ResponsiveContainer>
            </div>
            <button
              onClick={() => setShowChart(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* External Modals */}
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
