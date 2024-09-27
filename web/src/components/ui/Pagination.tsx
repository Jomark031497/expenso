import type { PaginationState } from "@/features/misc/misc.types";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

type PaginationProps = {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
};

export const Pagination = ({ currentPage, pageSize, totalCount, setPagination }: PaginationProps) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setPagination({
        pageSize,
        page: currentPage - 1,
      });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setPagination({
        pageSize,
        page: currentPage + 1,
      });
    }
  };

  return (
    <section className="flex items-center justify-end gap-2 p-2">
      <button className="rounded border p-1" onClick={handlePreviousPage} disabled={currentPage === 1}>
        <FaAngleLeft />
      </button>
      <span className="flex items-center gap-1 text-xs md:text-base">
        <div>Page</div>
        <strong>
          {totalCount ? currentPage : 0} of {totalPages}
        </strong>
      </span>
      <button className="rounded border p-1" onClick={handleNextPage} disabled={currentPage === totalPages}>
        <FaAngleRight />
      </button>
    </section>
  );
};
