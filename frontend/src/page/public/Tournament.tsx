import { ListTournament } from "@/components";
import { getTournament } from "@/stores/actions/tournamentActions";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Tournament = () => {
  const dispatch = useDispatch();
  const { tournaments } = useSelector((state: any) => state.tournaments);
  const [page, setPage] = React.useState(1);
  useEffect(() => {
    dispatch(getTournament(page, "desc") as any);
  }, [dispatch, page]);

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <div className="text-center mb-7">
        <h1 className="mx-auto text-3xl font-bold uppercase">
          Các giải đấu lớn
        </h1>
      </div>
      <ListTournament items={tournaments.data} />
      <div className="mt-[40px]">
        {tournaments.pagination && tournaments.pagination.totalPages > 1 && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && setPage(page - 1)}
                />
              </PaginationItem>

              {Array.from({ length: tournaments.pagination.totalPages }).map(
                (_, index) => {
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
                },
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    page < tournaments.pagination.totalPages &&
                    setPage(page + 1)
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

export default Tournament;
