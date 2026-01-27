import { ListCourt } from "@/components";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { getCourts } from "@/stores/actions/courtActions";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Court = () => {
  const dispatch = useDispatch();
  const { courts } = useSelector((state: any) => state.courts);
  const [page, setPage] = React.useState(1);

  useEffect(() => {
    dispatch(getCourts(page, "desc") as any);
  }, [dispatch, page]);

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <div className='text-center mb-7'><h1 className='mx-auto text-3xl font-bold uppercase'>Các sân hiện có</h1></div>
      <ListCourt items={courts.data} />
      <div className="mt-[40px]">
        {courts.pagination && courts.pagination.totalPages > 1 && (
                <Pagination className="mt-6">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => page > 1 && setPage(page - 1)}
                      />
                    </PaginationItem>
        
                    {Array.from({ length: courts.pagination.totalPages }).map((_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            isActive={page === pageNumber}
                            onClick={() => setPage(pageNumber)}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
        
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          page < courts.pagination.totalPages && setPage(page + 1)
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
      </div>
    </div>
  );
};

export default Court;
