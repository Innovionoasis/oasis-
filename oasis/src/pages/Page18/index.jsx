import { useEffect, useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { Heading, Text, Input, Img, Button, SelectBox } from "../../components";
import Sidebar8 from "../../components/Sidebar8";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Header from "../../components/Header";
import { createColumnHelper } from "@tanstack/react-table";
import { CloseSVG } from "../../components/Input/close";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";

const dropDownOptions = [
  { label: "الأحدث", value: "latest" },
  { label: "الأقدم", value: "oldest" },
];

export default function Page18Page() {
  const [ideas, setIdeas] = useState([]);
  const [stats, setStats] = useState([]);
  const [searchBarValue, setSearchBarValue] = useState("");
  const [sortOption, setSortOption] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 3;
  const fetchIdeas = async () => {
    try {
      const response = await fetch("http://localhost:4000/custom/acceptedIdeasWithDetails")  ;
      const data = await response.json();
      console.log("Fetched ideas:", data);
  
      if (Array.isArray(data)) {
        setIdeas(data);
      } else if (data && Array.isArray(data.data)) {
        setIdeas(data.data);
      } else {
        console.error("Unexpected data format:", data);
        setIdeas([]);
      }
    } catch (err) {
      console.error("❌ Error fetching ideas:", err);
      setIdeas([]);
    }
  };
  
  const fetchStats = async () => {
    try {
      const response = await fetch("http://localhost:4000/custom/reviewStats");

      const data = await response.json();
      console.log("Fetched stats:", data);
      setStats(data);
    } catch (err) {
      console.error("❌ Error fetching stats:", err);
      setStats([]); 
    }
  };
  
  useEffect(() => {
    fetchIdeas();
    fetchStats();
  }, []);
  
  const filteredAndSortedData = useMemo(() => {
    const filtered = ideas.filter((item) => {
      const searchLower = searchBarValue.toLowerCase();
      return (
        item.title?.toLowerCase().includes(searchLower) ||
        item.innovator?.toLowerCase().includes(searchLower)
      );
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOption === "latest" ? dateB - dateA : dateA - dateB;
    });
  }, [ideas, searchBarValue, sortOption]);

  const pageCount = Math.ceil(filteredAndSortedData.length / rowsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const columnHelper = createColumnHelper();
  const tableColumns = useMemo(() => [
    columnHelper.accessor("created_at", {
      header: "التاريخ",
      cell: (info) => <div className="text-center">{info.getValue()?.split("T")[0]}</div>,
    }),
    columnHelper.accessor("rating", {
      header: "النتيجة النهائية",
      cell: (info) => <div className="text-center">{info.getValue()}</div>,
    }),
    columnHelper.accessor("innovator_name", {
      header: "اسم المبتكر",
      cell: (info) => <div className="text-center">{info.getValue()}</div>,
    }),
    
    columnHelper.accessor("category", {
      header: "الفئة",
      cell: (info) => <div className="text-center">{info.getValue()}</div>,
    }),
    columnHelper.accessor("attachments", {
      header: "المرفقات",
      cell: (info) => {
        const raw = info.getValue();
        let url = "";
        if (typeof raw === "string") {
          try {
            const parsed = JSON.parse(raw);
            url = parsed?.[0]?.url;
          } catch {
            url = raw;
          }
        } else if (Array.isArray(raw)) {
          url = raw?.[0]?.url;
        }

        return url ? (
          <a href={`http://localhost:4000${url}`} download className="bg-white text-gray-800 px-1 py-0.5 rounded border shadow-sm text-xs">
            📄 تحميل
          </a>
        ) : (
          "لا يوجد مرفقات"
        );
      }
    }),
  ], []);

  const underReviewCount = stats.find(item => item.status === "تحتاج لتقييم")?.count || 0;
  const evaluatedCount = stats.reduce((sum, item) => {
    return item.status !== "تحتاج لتقييم" ? sum + parseInt(item.count) : sum;
  }, 0);
  const total = stats.reduce((sum, item) => sum + parseInt(item.count), 0) || 1;

  const evaluatedPercent = Math.round((evaluatedCount / total) * 100);
  const underReviewPercent = Math.round((underReviewCount / total) * 100);

  const ReactTable = ({ columns, data }) => {
    const table = useReactTable({
      columns,
      data,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
    });

    return (
      <table className="w-full text-center">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="p-4 border-b text-gray-700 bg-gray-100"
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-gray-200 hover:bg-gray-50 transition-all duration-200"
              style={{ height: "60px" }}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-4">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <>
      <Helmet>
        <title>مشاريع تم تقييمها - منصة الابتكار</title>
      </Helmet>
      <div className="w-full bg-w_background">
        <Header />
        <div className="mb-2 flex flex-col items-center text-center mt-10">
          <Heading as="h1" className="text-[40px] font-extrabold text-gray-800 leading-[70px]">
            مشاريع تم تقييمها
          </Heading>
        </div>
        <div className="mb-4 mt-[-10px]">
          <div className="mr-[60px] flex items-start gap-1 md:mr-0">
            <Sidebar8 />
            <div className="flex flex-1 flex-col gap-[20px] self-end sm:gap-[15px]">
              <div className="w-full flex justify-center items-start min-h-[60vh] mt-6">
                <div className="w-3/4 p-4 bg-white rounded-xl shadow-md">
                  <div className="flex justify-center items-center gap-2 mt-2">
                    <SelectBox
                      color="gray_50_04"
                      size="xs"
                      shape="round"
                      indicator={<Img src="images/img_arrowdown.svg" alt="Arrow Down" className="h-5 w-4" />}
                      name="sort"
                      placeholder={`فرز حسب: الأحدث `}
                      options={dropDownOptions}
                      onChange={(selected) => setSortOption(selected.value)}
                      className="w-1/4 md:w-1/2 rounded-md font-poppins"
                    />
                    <Input
                      color="gray_50_04"
                      size="lg"
                      shape="round"
                      name="search"
                      placeholder="بحث"
                      value={searchBarValue}
                      onChange={(e) => setSearchBarValue(e.target.value)}
                      prefix={<Img src="images/img_search_1.svg" alt="بحث" className="h-5 w-6" />}
                      suffix={searchBarValue && <CloseSVG onClick={() => setSearchBarValue("")} height={22} width={32} fillColor="#7e7e7e" />}
                      className="w-1/3 md:w-1/2 rounded-md font-poppins"
                    />
                  </div>

                  <ReactTable columns={tableColumns} data={paginatedData} />

                  <div className="flex justify-center items-center gap-2 mt-5">
                    <Button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} className="border border-gray-300 px-3 rounded">&lt;</Button>
                    {[...Array(pageCount)].map((_, i) => (
                      <Button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`border px-3 rounded ${currentPage === i + 1 ? 'bg-deep_purple-a400 text-white' : 'border-gray-300'}`}
                      >
                        {i + 1}
                      </Button>
                    ))}
                    <Button onClick={() => setCurrentPage((p) => Math.min(p + 1, pageCount))} className="border border-gray-300 px-3 rounded">&gt;</Button>
                  </div>
                </div>
              </div>
              <div className="ml-[332px] mr-[274px] flex flex-col gap-3.5 md:mx-0 mt-4">
                <div className="ml-[50px] mr-5 md:mx-0 mt-[-20px]">
                  <div className="flex flex-col items-center">
                    <Text size="m3_display_medium" as="p" className="text-[45px] font-normal">
                      إحصائيات
                    </Text>
                    <div className="mt-[-4px] flex items-center self-stretch">
                      <div className="h-px flex-1 bg-black-900" />
                      <div className="ml-9 h-[20px] w-[14px] rounded-full bg-blue_gray-500_02" />
                      <div className="ml-3.5 h-[20px] w-[14px] rounded-full bg-blue_gray-500_02" />
                      <div className="ml-2.5 h-[20px] w-[14px] rounded-full bg-blue_gray-500_02" />
                      <div className="ml-[50px] h-px flex-1 bg-black-900" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-20 items-center">
  <div className="flex flex-col items-center min-w-[150px]">
    <CircularProgressbar value={evaluatedPercent} strokeWidth={10} className="h-[100px] w-[100px]" />
    <p className="mt-2 text-lg font-semibold text-green-600">
      {evaluatedCount} تم التقييم
    </p>
    <span className="text-sm text-gray-600">({evaluatedPercent}%)</span>
  </div>

  <div className="flex flex-col items-center min-w-[150px]">
    <CircularProgressbar value={underReviewPercent} strokeWidth={10} className="h-[100px] w-[100px]" />
    <p className="mt-2 text-lg font-semibold text-yellow-600">
      {underReviewCount} قيد التقييم
    </p>
    <span className="text-sm text-gray-600">({underReviewPercent}%)</span>
  </div>
</div>

                <div className="mt-3 text-gray-700 text-sm text-center">
                  المجموع الكلي للأفكار: <span className="font-bold">{total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
