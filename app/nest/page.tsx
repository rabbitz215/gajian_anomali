"use client";

import { useEffect, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { supabase } from "@/lib/supabase";

/* ---------------- TYPES ---------------- */

type Player = {
  nickname: string;
  stamp: number;
};

type Barang = {
  name: string;
  gold: number;
  silver: number;
  copper: number;
};

type Nest = {
  title: string;
};

/* ---------------- PAGE ---------------- */

export default function NestPage() {
  const [nests, setNests] = useState<Nest[]>([]);
  const [mode, setMode] = useState<"index" | "create" | "edit">("index");
  const [selectedNest, setSelectedNest] = useState<any>(null);

  useEffect(() => {
    document.title = "GAJIAN ANOMALI";
  }, []);

  const fetchNests = async () => {
    const { data, error } = await supabase
      .from("nests")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setNests(data || []);
  };

  const deleteNest = async (nest: any) => {
    const confirm = window.confirm(
      `Delete "${nest.title}"?\nThis action cannot be undone.`
    );

    if (!confirm) return;

    try {
      // hapus child dulu
      await supabase.from("nest_players").delete().eq("nest_id", nest.id);
      await supabase.from("nest_barang").delete().eq("nest_id", nest.id);

      // hapus parent
      await supabase.from("nests").delete().eq("id", nest.id);

      fetchNests();
    } catch (err) {
      console.error(err);
      alert("Failed to delete nest");
    }
  };

  useEffect(() => {
    fetchNests();
  }, []);

  if (mode === "create") {
    return (
      <CreateNest
        onCancel={() => setMode("index")}
        onSave={() => {
          fetchNests();
          setMode("index");
        }}
      />
    );
  }

  if (mode === "edit") {
    return (
      <CreateNest
        initialData={selectedNest}
        onCancel={() => setMode("index")}
        onSave={() => {
          fetchNests();
          setMode("index");
        }}
      />
    );
  }

  return (
    <NestIndex
      nests={nests}
      onCreate={() => setMode("create")}
      onEdit={(nest) => {
        setSelectedNest(nest);
        setMode("edit");
      }}
      onDelete={deleteNest}
    />
  );
}

/* ---------------- INDEX ---------------- */

function NestIndex({
  nests,
  onCreate,
  onEdit,
  onDelete,
}: {
  nests: any[];
  onCreate: () => void;
  onEdit: (nest: any) => void;
  onDelete: (nest: any) => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with gradient */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              GAJIAN NEST
            </h2>
            <p className="text-gray-600 mt-1">
              Manage your guild raids and rewards
            </p>
          </div>
          <button
            onClick={onCreate}
            className="group relative bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              <span className="text-2xl">+</span>
              Create Nest
            </span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur"></div>
          </button>
        </div>

        {/* Nests Grid */}
        {nests.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">🏰</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No Nests Yet
            </h3>
            <p className="text-gray-500">
              Create your first nest to start managing raid rewards!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nests.map((nest) => (
              <div
                key={nest.id}
                className="group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105"
              >
                {/* Gradient Border Effect */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"
                  style={{ padding: "2px" }}
                >
                  <div className="bg-white rounded-2xl h-full w-full"></div>
                </div>

                {/* Content */}
                <div
                  className="relative p-6 cursor-pointer"
                  onClick={() => onEdit(nest)}
                >
                  {/* Icon Badge */}
                  <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
                    🏆
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-800 mb-4 pr-12">
                    {nest.title}
                  </h3>

                  {/* Stats */}
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 border border-orange-200/50">
                      <p className="text-xs font-semibold text-orange-800 mb-1">
                        TOTAL SALARY
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 bg-yellow-500 text-white px-2 py-1 rounded-lg font-bold text-sm shadow">
                          <span className="text-xs">💰</span>
                          {nest.total_salary_gold} G
                        </span>
                        <span className="inline-flex items-center gap-1 bg-gray-400 text-white px-2 py-1 rounded-lg font-bold text-sm shadow">
                          <span className="text-xs">⚪</span>
                          {nest.total_salary_silver} S
                        </span>
                        <span className="inline-flex items-center gap-1 bg-orange-600 text-white px-2 py-1 rounded-lg font-bold text-sm shadow">
                          <span className="text-xs">🟤</span>
                          {nest.total_salary_copper} C
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(nest);
                    }}
                    className="absolute bottom-4 right-4 text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                    title="Delete nest"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- CREATE FORM ---------------- */
function CreateNest({
  onCancel,
  onSave,
  initialData,
}: {
  onCancel: () => void;
  onSave: () => void;
  initialData?: any;
}) {
  const [title, setTitle] = useState("");
  const [barang, setBarang] = useState<Barang[]>([
    { name: "", gold: 0, silver: 0, copper: 0 },
  ]);

  const [players, setPlayers] = useState<Player[]>(
    Array.from({ length: 8 }, () => ({
      nickname: "",
      stamp: 0,
    }))
  );

  useEffect(() => {
    if (!initialData) return;

    setTitle(initialData.title);
    setStampGoldPrice(initialData.stamp_price_gold);

    fetchNestDetail(initialData.id);
  }, []);

  const fetchNestDetail = async (nestId: string) => {
    const { data: barangData } = await supabase
      .from("nest_barang")
      .select("*")
      .eq("nest_id", nestId);

    const { data: playerData } = await supabase
      .from("nest_players")
      .select("*")
      .eq("nest_id", nestId);

    if (barangData) setBarang(barangData);

    if (playerData) {
      setPlayers(
        Array.from({ length: 8 }, (_, i) => ({
          nickname: playerData[i]?.nickname || "",
          stamp: playerData[i]?.stamps || 0,
        }))
      );
    }
  };

  /* --------- UTILS --------- */

  const toCopper = (g: number, s: number, c: number) => g * 10000 + s * 100 + c;

  const fromCopper = (total: number) => {
    const gold = Math.floor(total / 10000);
    total %= 10000;
    const silver = Math.floor(total / 100);
    const copper = total % 100;
    return { gold, silver, copper };
  };

  const [stampGoldPrice, setStampGoldPrice] = useState(2);

  const stampValueCopper = stampGoldPrice * 10000;

  const totalBarangCopper = barang.reduce(
    (sum, b) => sum + toCopper(b.gold, b.silver, b.copper),
    0
  );

  const totalBarang = fromCopper(totalBarangCopper);

  const totalStampCost = players.reduce(
    (sum, p) => sum + p.stamp * stampValueCopper,
    0
  );

  const remainingPool = Math.max(totalBarangCopper - totalStampCost, 0);

  const activePlayers = players.filter((p) => p.nickname.trim() !== "");

  const activePlayerCount = activePlayers.length;

  const baseSalaryCopper =
    activePlayerCount > 0 ? Math.floor(remainingPool / activePlayerCount) : 0;

  const getFinalSalary = (stamp: number) => {
    const finalCopper = baseSalaryCopper + stamp * stampValueCopper;
    return fromCopper(finalCopper);
  };

  /* --------- HANDLERS --------- */

  const addPlayer = () => {
    if (players.length >= 8) return;
    setPlayers([...players, { nickname: "", stamp: 0 }]);
  };

  const addBarang = () => {
    setBarang([...barang, { name: "", gold: 0, silver: 0, copper: 0 }]);
  };

  const removeBarang = (index: number) => {
    if (barang.length <= 1) return;

    setBarang((prev) => prev.filter((_, i) => i !== index));
  };

  const totalSalaryCopper = activePlayers.reduce((sum, p) => {
    const salary = getFinalSalary(p.stamp);
    return sum + toCopper(salary.gold, salary.silver, salary.copper);
  }, 0);

  const totalSalary = fromCopper(totalSalaryCopper);

  /* --------- API --------- */
  const saveNest = async () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    try {
      let nestId = initialData?.id;

      /* =========================
       UPDATE MODE
    ========================= */
      if (initialData) {
        await supabase
          .from("nests")
          .update({
            title,
            stamp_price_gold: stampGoldPrice,
            total_gold: totalBarang.gold,
            total_silver: totalBarang.silver,
            total_copper: totalBarang.copper,

            total_salary_gold: totalSalary.gold,
            total_salary_silver: totalSalary.silver,
            total_salary_copper: totalSalary.copper,
          })
          .eq("id", initialData.id);

        // hapus data lama
        await supabase.from("nest_players").delete().eq("nest_id", nestId);
        await supabase.from("nest_barang").delete().eq("nest_id", nestId);
      }

      /* =========================
       CREATE MODE
    ========================= */
      if (!initialData) {
        const { data: nest, error } = await supabase
          .from("nests")
          .insert({
            title,
            stamp_price_gold: stampGoldPrice,
            total_gold: totalBarang.gold,
            total_silver: totalBarang.silver,
            total_copper: totalBarang.copper,

            total_salary_gold: totalSalary.gold,
            total_salary_silver: totalSalary.silver,
            total_salary_copper: totalSalary.copper,
          })
          .select()
          .single();

        if (error) throw error;

        nestId = nest.id;
      }

      /* =========================
       INSERT PLAYERS
    ========================= */
      const playersPayload = players.map((p) => {
        const salary = getFinalSalary(p.stamp);

        return {
          nest_id: nestId,
          nickname: p.nickname,
          stamps: p.stamp,
          salary_gold: salary.gold,
          salary_silver: salary.silver,
          salary_copper: salary.copper,
        };
      });

      await supabase.from("nest_players").insert(playersPayload);

      /* =========================
       INSERT BARANG
    ========================= */
      const barangPayload = barang.map((b) => ({
        nest_id: nestId,
        name: b.name,
        gold: b.gold,
        silver: b.silver,
        copper: b.copper,
      }));

      await supabase.from("nest_barang").insert(barangPayload);

      alert("Nest saved successfully!");
      onSave(); // refresh index & back
    } catch (err) {
      console.error(err);
      alert("Failed to save nest");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="w-full mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <button
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-800 font-medium flex items-center gap-2 hover:gap-3 transition-all"
          >
            <span className="text-xl">←</span>
            Back to List
          </button>

          <div className="text-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              {initialData ? "GAJIAN NEST - Edit" : "GAJIAN NEST - Create"}
            </h2>
            <p className="text-gray-500 text-xs mt-1">
              Configure your raid and calculate rewards
            </p>
          </div>

          <div className="w-[100px]"></div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT SECTION */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-8">
            {/* Title */}
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block uppercase tracking-wide">
                Nest Title
              </label>
              <input
                className="w-full border-2 border-purple-200 rounded-lg px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                placeholder="Enter nest name (e.g., Karahan Kontol)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm shadow">
                  👥
                </div>
                <h3 className="text-lg font-bold text-gray-800">Players</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {players.map((player, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 space-y-1.5 border border-blue-100 hover:border-blue-300 transition-all"
                  >
                    <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">
                      Player {index + 1}
                    </p>

                    <input
                      placeholder="Enter nickname"
                      className="w-full border border-blue-200 rounded px-2 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all"
                      value={player.nickname}
                      onChange={(e) => {
                        const copy = [...players];
                        copy[index].nickname = e.target.value;
                        setPlayers(copy);
                      }}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Stamp Price */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center text-white text-sm shadow">
                  🎫
                </div>
                <h3 className="text-lg font-bold text-gray-800">Harga Stamp</h3>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
                <label className="text-xs font-semibold text-yellow-800 uppercase tracking-wide mb-2 block">
                  Gold per Stamp
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    placeholder="0"
                    className="border border-yellow-300 rounded px-3 py-2 w-24 text-sm font-bold text-yellow-900 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-100"
                    value={stampGoldPrice}
                    onChange={(e) => setStampGoldPrice(Number(e.target.value))}
                  />
                  <div className="flex items-center gap-1.5 bg-yellow-500 text-white px-3 py-2 rounded text-sm font-bold shadow">
                    <span className="text-xs">💰</span>
                    <span>Gold</span>
                  </div>
                </div>
                <p className="text-xs text-yellow-700 mt-2 font-medium">
                  1 stamp = {stampGoldPrice} Gold
                </p>
              </div>
            </section>

            {/* Stamps */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center text-white text-sm shadow">
                  🎟️
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  Penggunaan Stamp
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {players.map((player, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg p-3 space-y-2 border border-pink-200 hover:border-pink-300 transition-all"
                  >
                    <p className="text-[10px] font-bold text-pink-700 uppercase tracking-wide truncate">
                      {player.nickname.trim() !== ""
                        ? player.nickname
                        : `Player ${index + 1}`}
                    </p>

                    <input
                      type="number"
                      min={0}
                      placeholder="0"
                      className="w-full border border-pink-200 rounded px-2 py-1.5 text-center text-sm font-bold focus:border-pink-500 focus:ring-1 focus:ring-pink-100 transition-all"
                      value={player.stamp}
                      onChange={(e) => {
                        const copy = [...players];
                        copy[index].stamp = Number(e.target.value);
                        setPlayers(copy);
                      }}
                    />

                    <div className="bg-pink-600 text-white px-2 py-1.5 rounded text-center text-xs font-semibold shadow">
                      = {player.stamp * stampGoldPrice} 💰 Gold
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Barang */}
            <section>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white text-sm shadow">
                    📦
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Barang</h3>
                </div>
                <button
                  onClick={addBarang}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-1.5"
                >
                  <span className="text-lg">+</span>
                  Tambah
                </button>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200 space-y-2">
                {/* Header */}
                <div className="grid grid-cols-7 px-3 py-2 text-[10px] font-bold text-emerald-800 bg-emerald-100 rounded uppercase tracking-wide">
                  <div className="col-span-3">Item Name</div>
                  <div className="text-center">💰 G</div>
                  <div className="text-center">⚪ S</div>
                  <div className="text-center">🟤 C</div>
                  <div />
                </div>

                {/* Rows */}
                {barang.map((b, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-7 px-3 py-2 items-center bg-white rounded border border-emerald-100 hover:border-emerald-300 transition-all"
                  >
                    {/* Item Name */}
                    <input
                      className="col-span-3 bg-transparent text-xs font-medium placeholder-gray-400 focus:outline-none px-1"
                      placeholder="e.g., L RING"
                      value={b.name}
                      onChange={(e) => {
                        const copy = [...barang];
                        copy[i].name = e.target.value;
                        setBarang(copy);
                      }}
                    />

                    {/* Gold */}
                    <input
                      type="number"
                      min={0}
                      placeholder="0"
                      className="text-center bg-yellow-50 border border-yellow-200 rounded px-1 py-0.5 text-xs font-bold focus:outline-none focus:border-yellow-400"
                      value={b.gold}
                      onChange={(e) => {
                        const copy = [...barang];
                        copy[i].gold = Number(e.target.value);
                        setBarang(copy);
                      }}
                    />

                    {/* Silver */}
                    <input
                      type="number"
                      min={0}
                      placeholder="0"
                      className="text-center bg-gray-50 border border-gray-200 rounded px-1 py-0.5 text-xs font-bold focus:outline-none focus:border-gray-400"
                      value={b.silver}
                      onChange={(e) => {
                        const copy = [...barang];
                        copy[i].silver = Number(e.target.value);
                        setBarang(copy);
                      }}
                    />

                    {/* Copper */}
                    <input
                      type="number"
                      min={0}
                      placeholder="0"
                      className="text-center bg-orange-50 border border-orange-200 rounded px-1 py-0.5 text-xs font-bold focus:outline-none focus:border-orange-400"
                      value={b.copper}
                      onChange={(e) => {
                        const copy = [...barang];
                        copy[i].copper = Number(e.target.value);
                        setBarang(copy);
                      }}
                    />

                    {/* Remove */}
                    <button
                      type="button"
                      disabled={barang.length <= 1}
                      onClick={() => removeBarang(i)}
                      className={`flex justify-center ${
                        barang.length <= 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-400 hover:text-red-500 hover:bg-red-50 rounded p-0.5"
                      }`}
                      title="Remove item"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {/* Total Barang */}
                <div className="mt-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-3 flex justify-between items-center shadow">
                  <span className="text-white text-xs font-bold uppercase tracking-wide">
                    Total Loot Value
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="bg-white text-yellow-700 px-2 py-1 rounded text-xs font-bold">
                      {totalBarang.gold} G
                    </span>
                    <span className="bg-white text-gray-700 px-2 py-1 rounded text-xs font-bold">
                      {totalBarang.silver} S
                    </span>
                    <span className="bg-white text-orange-700 px-2 py-1 rounded text-xs font-bold">
                      {totalBarang.copper} C
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT SECTION - Salary Summary */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-sm shadow">
                  💵
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  Summary Gajian
                </h3>
              </div>

              <div className="overflow-x-auto">
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="border-b border-purple-300">
                        <th className="px-2 py-2 text-left font-bold text-purple-800 uppercase tracking-wide text-[10px]">
                          Player
                        </th>
                        <th className="px-2 py-2 text-left font-bold text-purple-800 uppercase tracking-wide text-[10px]">
                          Base Salary
                        </th>
                        <th className="px-2 py-2 text-left font-bold text-purple-800 uppercase tracking-wide text-[10px]">
                          Stamp
                        </th>
                        <th className="px-2 py-2 text-right font-bold text-purple-800 uppercase tracking-wide text-[10px]">
                          Final Salary
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {activePlayers.map((player, index) => {
                        const base = fromCopper(baseSalaryCopper);
                        const stampSalary = fromCopper(
                          player.stamp * stampValueCopper
                        );
                        const finalSalary = getFinalSalary(player.stamp);

                        return (
                          <tr
                            key={index}
                            className="border-b border-purple-100 hover:bg-purple-100/50 transition-colors"
                          >
                            <td className="px-2 py-2 font-bold text-gray-800 text-xs">
                              {player.nickname.trim() !== ""
                                ? player.nickname
                                : `Player ${index + 1}`}
                            </td>

                            <td className="px-2 py-2">
                              <div className="flex items-center gap-1">
                                <span className="bg-yellow-500 text-white px-1.5 py-0.5 rounded font-bold text-[10px]">
                                  {base.gold}G
                                </span>
                                <span className="bg-gray-400 text-white px-1.5 py-0.5 rounded font-bold text-[10px]">
                                  {base.silver}S
                                </span>
                                <span className="bg-orange-600 text-white px-1.5 py-0.5 rounded font-bold text-[10px]">
                                  {base.copper}C
                                </span>
                              </div>
                            </td>

                            <td className="px-2 py-2">
                              <div className="flex items-center gap-1">
                                <span className="bg-yellow-500 text-white px-1.5 py-0.5 rounded font-bold text-[10px]">
                                  {stampSalary.gold}G
                                </span>
                                <span className="bg-gray-400 text-white px-1.5 py-0.5 rounded font-bold text-[10px]">
                                  {stampSalary.silver}S
                                </span>
                                <span className="bg-orange-600 text-white px-1.5 py-0.5 rounded font-bold text-[10px]">
                                  {stampSalary.copper}C
                                </span>
                              </div>
                            </td>

                            <td className="px-2 py-2 text-right">
                              <div className="flex items-center gap-1 justify-end">
                                <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded font-bold text-xs shadow">
                                  {finalSalary.gold}G
                                </span>
                                <span className="bg-gray-500 text-white px-2 py-1 rounded font-bold text-xs shadow">
                                  {finalSalary.silver}S
                                </span>
                                <span className="bg-orange-700 text-white px-2 py-1 rounded font-bold text-xs shadow">
                                  {finalSalary.copper}C
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Warning */}
              {totalStampCost > totalBarangCopper && (
                <div className="mt-3 bg-red-100 border border-red-400 rounded-lg p-3 flex items-center gap-2">
                  <span className="text-xl">⚠️</span>
                  <p className="text-red-700 text-xs font-semibold">
                    Warning: Total stamp value exceeds total loot value!
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={saveNest}
            className="group relative px-8 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center gap-1.5">
              <span className="text-base">💾</span>
              Save Nest
            </span>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur"></div>
          </button>
        </div>
      </div>
    </div>
  );
}
