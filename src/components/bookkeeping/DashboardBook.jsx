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
  CalendarDays,
  UserCircle2,
  TrendingUp,
  Wallet,
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
  const { user, userData, logout } = useAuth();

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

  const formatDate = (value, options = {}) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      ...options,
    });
  };

  const classificationColors = {
    Tumbuh: "bg-amber-100 text-amber-700 border-amber-200",
    Berkembang: "bg-blue-100 text-blue-700 border-blue-200",
    Mandiri: "bg-emerald-100 text-emerald-700 border-emerald-200",
  };

  const latestRecord = datasets[0];
  const latestClassification = latestRecord?.meta?.klasifikasi;
  const classificationBadgeClass =
    classificationColors[latestClassification] ||
    "bg-slate-100 text-slate-700 border-slate-200";
  const latestOmset = latestRecord ? getOmset(latestRecord) : 0;
  const latestBiaya = latestRecord ? getTotalBiaya(latestRecord) : 0;
  const latestLaba = latestOmset - latestBiaya;

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
      <section className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <div className="rounded-3xl bg-white/90 backdrop-blur border border-white shadow-sm p-6 space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2 text-center md:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Program CSR RAPP · Estate Cerenti
              </p>
              <h2 className="text-3xl font-bold text-slate-900">
                Pembukuan UMKM
              </h2>
              <p className="text-sm text-slate-600">
                {latestClassification
                  ? `Status usaha berada pada kategori ${latestClassification}.`
                  : "Pantau pencatatan pembukuan untuk mengetahui perkembangan usaha."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <button
                onClick={onAddForm}
                className="h-10 px-4 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition flex items-center gap-2 justify-center"
              >
                <Plus className="h-4 w-4" /> Input Data Baru
              </button>
              <button
                onClick={() => setShowChart(true)}
                className="h-10 px-4 rounded-xl bg-blue-500/90 text-white text-sm font-semibold hover:bg-blue-600 transition flex items-center gap-2 justify-center"
              >
                <LineChartIcon className="h-4 w-4" /> Grafik
              </button>
              <button
                onClick={logout}
                className="h-10 px-4 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition flex items-center gap-2 justify-center"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-gradient-to-r from-emerald-500 to-green-400 text-white rounded-2xl p-5 shadow-inner space-y-2">
              <p className="text-xs uppercase tracking-wide text-white/70">
                Profil UMKM
              </p>
              <p className="text-xl font-semibold">
                {userData?.usaha || "UMKM Binaan"}
              </p>
              <p className="text-sm text-white/80">
                {userData?.nama || "Mitra"}
                {userData?.desa ? ` · ${userData.desa}` : ""}
              </p>
              {latestClassification && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium ${classificationBadgeClass}`}
                >
                  <UserCircle2 className="h-4 w-4" /> {latestClassification}
                </span>
              )}
            </div>

            <div className="rounded-2xl border border-slate-100 p-5 bg-slate-50">
              <dl className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                <div>
                  <dt className="font-semibold text-slate-800">CDO</dt>
                  <dd>{userData?.cdo || "-"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-800">Kota/Kab</dt>
                  <dd>{userData?.kota || "-"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-800">Desa</dt>
                  <dd>{userData?.desa || "-"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-800">Kontak</dt>
                  <dd>{userData?.hp || "-"}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Total Omset
            </p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-2xl font-bold text-slate-900">
                {toIDR(kpi.totalOmset)}
              </p>
              <Wallet className="h-6 w-6 text-emerald-500" />
            </div>
          </div>
          <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Total Biaya Operasional
            </p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-2xl font-bold text-slate-900">
                {toIDR(kpi.totalBiaya)}
              </p>
              <CalendarDays className="h-6 w-6 text-amber-500" />
            </div>
          </div>
          <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Rata-rata Omset
            </p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-2xl font-bold text-slate-900">
                {toIDR(kpi.avgOmset)}
              </p>
              <LineChartIcon className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Perubahan Bulan Terakhir
            </p>
            <div className="flex items-center justify-between mt-2">
              <p
                className={`text-2xl font-bold ${
                  kpi.growth >= 0 ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {kpi.growth >= 0 ? "+" : ""}
                {kpi.growth.toFixed(1)}%
              </p>
              <TrendingUp className="h-6 w-6 text-slate-500" />
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Riwayat Monitoring
                </h3>
                <p className="text-xs text-slate-500">
                  Urutkan berdasarkan omset untuk melihat performa terbaik
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                Urut: {sortOrder === "asc" ? "Terendah" : "Tertinggi"}
              </button>
            </div>
            {loadingData ? (
              <div className="flex justify-center items-center py-12 text-slate-500">
                Memuat data...
              </div>
            ) : datasets.length === 0 ? (
              <div className="text-center py-14 px-6">
                <p className="text-base font-semibold text-slate-800">
                  Belum ada data monitoring
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  Klik tombol “Input Data Baru” untuk menambahkan catatan pertama.
                </p>
                <button
                  onClick={onAddForm}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-600"
                >
                  <Plus className="h-4 w-4" /> Input Data
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold">Tanggal</th>
                      <th className="px-6 py-3 text-left font-semibold">Omset</th>
                      <th className="px-6 py-3 text-left font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedDatasets.map((d) => (
                      <tr key={d.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                        <td className="px-6 py-3 text-slate-800">
                          {formatDate(d?.meta?.tanggal, { dateStyle: "medium" })}
                        </td>
                        <td className="px-6 py-3 font-semibold text-slate-900">
                          {toIDR(getOmset(d))}
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleView(d)}
                              className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                            >
                              <Eye className="h-3.5 w-3.5" /> Detail
                            </button>
                            <button
                              onClick={() => handleEdit(d)}
                              className="inline-flex items-center gap-1 rounded-full border border-amber-200 px-4 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-50"
                            >
                              <Pencil className="h-3.5 w-3.5" /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(d.id)}
                              className="inline-flex items-center gap-1 rounded-full border border-rose-200 px-4 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Hapus
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

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  Monitoring Terakhir
                </h3>
                {latestRecord && (
                  <button
                    onClick={() => handleView(latestRecord)}
                    className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    Lihat detail
                  </button>
                )}
              </div>
              {latestRecord ? (
                <ul className="text-sm text-slate-600 space-y-1">
                  <li className="flex justify-between">
                    <span>Tanggal</span>
                    <span className="font-semibold text-slate-900">
                      {formatDate(latestRecord.meta?.tanggal, {
                        dateStyle: "long",
                      })}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Omset</span>
                    <span className="font-semibold text-slate-900">
                      {toIDR(latestOmset)}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Biaya Operasional</span>
                    <span className="font-semibold text-slate-900">
                      {toIDR(latestBiaya)}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Laba Bersih</span>
                    <span
                      className={`font-semibold ${
                        latestLaba >= 0 ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {toIDR(latestLaba)}
                    </span>
                  </li>
                </ul>
              ) : (
                <p className="text-sm text-slate-500">
                  Catatan monitoring akan tampil otomatis setelah kamu menyimpan data pertama.
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-3">
                <StickyNote className="h-5 w-5 text-blue-500" /> Catatan
              </h3>
              <form onSubmit={handleAddNote} className="flex flex-col gap-2 mb-4">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Tulis catatan singkat..."
                  maxLength={100}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
                <button
                  type="submit"
                  className="h-10 px-4 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition"
                >
                  Simpan Catatan
                </button>
              </form>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {notes.length === 0 && (
                  <p className="text-slate-500 text-sm text-center">
                    Belum ada catatan.
                  </p>
                )}
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm flex flex-col gap-1"
                  >
                    <span className="text-slate-800">{note.text}</span>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{formatDate(note.createdAt, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}</span>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-rose-500 hover:text-rose-600"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

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
