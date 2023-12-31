import type { ReadonlyURLSearchParams } from "next/navigation";
import type { DefaultValues } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Autocomplete } from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import { useDebouncedSearch } from "@/hooks/useDebounce";
import { api } from "@/trpc/react";
import { ImagePlaceholder } from "../ImagePlaceholder";
import { TMDBImage } from "../TMDBImage";

const CreateGameFormSchema = z.union([
  z.object({
    startMovieId: z.coerce.number(),
    startPersonId: z.undefined(),
    endMovieId: z.coerce.number(),
    endPersonId: z.undefined(),
  }),
  z.object({
    startMovieId: z.coerce.number(),
    startPersonId: z.undefined(),
    endMovieId: z.undefined(),
    endPersonId: z.coerce.number(),
  }),
  z.object({
    startMovieId: z.undefined(),
    startPersonId: z.coerce.number(),
    endMovieId: z.coerce.number(),
    endPersonId: z.undefined(),
  }),
  z.object({
    startMovieId: z.undefined(),
    startPersonId: z.coerce.number(),
    endMovieId: z.undefined(),
    endPersonId: z.coerce.number(),
  }),
]);

export type CreateGameFormType = z.infer<typeof CreateGameFormSchema>;

type SearchParamKey = "startMovie" | "endMovie" | "startPerson" | "endPerson";

const getSearchParam = (params: ReadonlyURLSearchParams, key: SearchParamKey) =>
  params.get(key) ?? undefined;

const parseSearchParam = (val: string | undefined): number | undefined =>
  val && !isNaN(parseInt(val)) ? parseInt(val) : undefined;

const getDefaultValues = ({
  existingStartMovieParam,
  existingStartPersonParam,
  existingEndMovieParam,
  existingEndPersonParam,
}: {
  existingStartMovieParam?: string;
  existingStartPersonParam?: string;
  existingEndMovieParam?: string;
  existingEndPersonParam?: string;
}): DefaultValues<CreateGameFormType> => {
  const res: DefaultValues<CreateGameFormType> = {};

  if (existingStartMovieParam) {
    res.startMovieId = parseSearchParam(existingStartMovieParam);
  }

  if (!existingStartMovieParam && existingStartPersonParam) {
    res.startPersonId = parseSearchParam(existingStartPersonParam);
  }

  if (existingEndMovieParam) {
    res.endMovieId = parseSearchParam(existingEndMovieParam);
  }

  if (!existingEndMovieParam && existingEndPersonParam) {
    res.endPersonId = parseSearchParam(existingEndPersonParam);
  }

  return res;
};

export const CreateGameForm = ({
  onSubmit,
}: {
  onSubmit: (form: CreateGameFormType) => void;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const existingStartMovieParam = getSearchParam(searchParams, "startMovie");
  const existingStartPersonParam = getSearchParam(searchParams, "startPerson");
  const existingEndMovieParam = getSearchParam(searchParams, "endMovie");
  const existingEndPersonParam = getSearchParam(searchParams, "endPerson");

  const {
    formState: { isValid },
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
  } = useForm<CreateGameFormType>({
    resolver: zodResolver(CreateGameFormSchema),
    defaultValues: getDefaultValues({
      existingStartMovieParam,
      existingStartPersonParam,
      existingEndMovieParam,
      existingEndPersonParam,
    }),
  });

  const currentStartMovieId = watch("startMovieId");
  const currentStartPersonId = watch("startPersonId");
  const currentEndMovieId = watch("endMovieId");
  const currentEndPersonId = watch("endPersonId");

  const [startMovieOpen, setStartMovieOpen] = useState(false);
  const [startMovieOptions, setStartMovieOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [startMovieQueryText, setStartMovieQueryText] = useState("");
  const debouncedStartMovie = useDebouncedSearch(startMovieQueryText, 1000);

  const [startPersonOpen, setStartPersonOpen] = useState(false);
  const [startPersonOptions, setStartPersonOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [startPersonQueryText, setStartPersonQueryText] = useState("");
  const debouncedStartPerson = useDebouncedSearch(startPersonQueryText, 1000);

  const [endMovieOpen, setEndMovieOpen] = useState(false);
  const [endMovieOptions, setEndMovieOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [endMovieQueryText, setEndMovieQueryText] = useState("");
  const debouncedEndMovie = useDebouncedSearch(endMovieQueryText, 1000);

  const [endPersonOpen, setEndPersonOpen] = useState(false);
  const [endPersonOptions, setEndPersonOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [endPersonQueryText, setEndPersonQueryText] = useState("");
  const debouncedEndPerson = useDebouncedSearch(endPersonQueryText, 1000);

  const { data: startMovies, isLoading: startMoviesLoading } =
    api.movie.search.useQuery(
      {
        title: debouncedStartMovie,
      },
      {
        enabled: debouncedStartMovie.length > 3,
      },
    );

  const { data: startPeople, isLoading: startPeopleLoading } =
    api.person.search.useQuery(
      {
        name: debouncedStartPerson,
      },
      {
        enabled: debouncedStartPerson.length > 3,
      },
    );

  const { data: endMovies, isLoading: endMoviesLoading } =
    api.movie.search.useQuery(
      {
        title: debouncedEndMovie,
      },
      {
        enabled: debouncedEndMovie.length > 3,
      },
    );

  const { data: endPeople, isLoading: endPeopleLoading } =
    api.person.search.useQuery(
      {
        name: debouncedEndPerson,
      },
      {
        enabled: debouncedEndPerson.length > 3,
      },
    );

  const { refetch: fetchRandomMovie } =
    api.movie.getRandomPopularMovie.useQuery(undefined, { enabled: false });
  const { refetch: fetchRandomPerson } =
    api.person.getRandomPopularPerson.useQuery(undefined, { enabled: false });

  const updateQueryParams = useCallback(
    (values: { key: SearchParamKey; value: string }[]) => {
      const currentParams = new URLSearchParams(
        Array.from(searchParams.entries()),
      );
      values.forEach(({ key, value }) => {
        if (value === "") {
          currentParams.delete(key);
        } else {
          currentParams.set(key, value);
        }
      });

      const search = currentParams.toString();
      const query = search !== "" ? `?${search}` : "";

      router.push(`${pathname}${query}`, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    const newResults =
      startMovies?.results
        .filter(({ release_date }) => dayjs(release_date).isValid())
        .map(({ id, title, release_date }) => ({
          value: id.toString(),
          label: `${title} (${dayjs(release_date).format("YYYY")})`,
        })) ?? [];

    setStartMovieOptions(newResults);
  }, [currentStartMovieId, setValue, startMovies]);

  useEffect(() => {
    const newResults =
      startPeople?.results.map(({ id, name }) => ({
        value: id.toString(),
        label: name,
      })) ?? [];

    setStartPersonOptions(newResults);
  }, [currentStartPersonId, setValue, startPeople]);

  useEffect(() => {
    const newResults =
      endMovies?.results
        .filter(({ release_date }) => dayjs(release_date).isValid())
        .map(({ id, title, release_date }) => ({
          value: id.toString(),
          label: `${title} (${dayjs(release_date).format("YYYY")})`,
        })) ?? [];

    setEndMovieOptions(newResults);
  }, [currentEndMovieId, setValue, endMovies]);

  useEffect(() => {
    const newResults =
      endPeople?.results.map(({ id, name }) => ({
        value: id.toString(),
        label: name,
      })) ?? [];

    setEndPersonOptions(newResults);
  }, [endPeople, currentEndPersonId, setValue]);

  const clearStart = useCallback(() => {
    setValue("startMovieId", undefined, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("startPersonId", undefined, {
      shouldValidate: true,
      shouldDirty: true,
    });

    updateQueryParams([
      {
        key: "startMovie",
        value: "",
      },
      {
        key: "startPerson",
        value: "",
      },
    ]);
  }, [setValue, updateQueryParams]);

  const clearEnd = useCallback(() => {
    setValue("endMovieId", undefined, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("endPersonId", undefined, {
      shouldValidate: true,
      shouldDirty: true,
    });
    updateQueryParams([
      {
        key: "endMovie",
        value: "",
      },
      {
        key: "endPerson",
        value: "",
      },
    ]);
  }, [setValue, updateQueryParams]);

  const { data: selectedStartMovie } = api.movie.getById.useQuery(
    {
      id: currentStartMovieId!,
    },
    {
      enabled: currentStartMovieId != null,
    },
  );

  const { data: selectedStartPerson } = api.person.getById.useQuery(
    {
      id: currentStartPersonId!,
    },
    {
      enabled: currentStartPersonId != null,
    },
  );

  const { data: selectedEndMovie } = api.movie.getById.useQuery(
    {
      id: currentEndMovieId!,
    },
    {
      enabled: currentEndMovieId != null,
    },
  );

  const { data: selectedEndPerson } = api.person.getById.useQuery(
    {
      id: currentEndPersonId!,
    },
    {
      enabled: currentEndPersonId != null,
    },
  );

  const selectRandomStart = useCallback(() => {
    const randomStartType = Math.random() < 0.5 ? "movie" : "person";

    if (randomStartType === "movie") {
      fetchRandomMovie()
        .then(({ data: movie }) => {
          setValue("startMovieId", movie?.id, {
            shouldValidate: true,
            shouldDirty: true,
          });
          setValue("startPersonId", undefined, {
            shouldValidate: true,
            shouldDirty: true,
          });

          updateQueryParams([
            {
              key: "startMovie",
              value: movie?.id.toString() ?? "",
            },
            {
              key: "startPerson",
              value: "",
            },
          ]);
        })
        .catch(() => toast("Something went wrong"));
    } else {
      fetchRandomPerson()
        .then(({ data: person }) => {
          setValue("startMovieId", undefined, {
            shouldValidate: true,
            shouldDirty: true,
          });
          setValue("startPersonId", person?.id, {
            shouldValidate: true,
            shouldDirty: true,
          });

          updateQueryParams([
            {
              key: "startPerson",
              value: person?.id.toString() ?? "",
            },
            {
              key: "startMovie",
              value: "",
            },
          ]);
        })
        .catch(() => toast("Something went wrong"));
    }
  }, [fetchRandomMovie, fetchRandomPerson, setValue, updateQueryParams]);

  const selectRandomEnd = useCallback(() => {
    const randomEndType = Math.random() < 0.5 ? "movie" : "person";

    if (randomEndType === "movie") {
      fetchRandomMovie()
        .then(({ data: movie }) => {
          setValue("endMovieId", movie?.id, {
            shouldValidate: true,
            shouldDirty: true,
          });
          setValue("endPersonId", undefined, {
            shouldValidate: true,
            shouldDirty: true,
          });
          updateQueryParams([
            {
              key: "endMovie",
              value: movie?.id.toString() ?? "",
            },
            {
              key: "endPerson",
              value: "",
            },
          ]);
        })
        .catch(() => toast("Something went wrong"));
    } else {
      fetchRandomPerson()
        .then(({ data: person }) => {
          setValue("endMovieId", undefined, {
            shouldValidate: true,
            shouldDirty: true,
          });
          setValue("endPersonId", person?.id, {
            shouldValidate: true,
            shouldDirty: true,
          });
          updateQueryParams([
            {
              key: "endMovie",
              value: "",
            },
            {
              key: "endPerson",
              value: person?.id.toString() ?? "",
            },
          ]);
        })
        .catch(() => toast("Something went wrong"));
    }
  }, [fetchRandomMovie, fetchRandomPerson, setValue, updateQueryParams]);

  return (
    <div className="container flex flex-col items-center">
      <div className="mt-12">
        <h2 className="text-4xl font-bold">Step 1: Choose a starting point</h2>
      </div>
      <div className="mt-12 flex flex-wrap justify-center gap-8 sm:w-[600px] sm:flex-nowrap">
        <div className="flex flex-col justify-center gap-8">
          <div className="flex justify-center sm:justify-start">
            <Controller
              control={control}
              name="startMovieId"
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  open={startMovieOpen}
                  setOpen={setStartMovieOpen}
                  onSelectOption={(id) => {
                    onChange(id !== "" ? parseInt(id) : null);
                    updateQueryParams([
                      {
                        key: "startMovie",
                        value: id,
                      },
                    ]);
                  }}
                  value={value ? value.toString() : ""}
                  searchText={startMovieQueryText}
                  setSearchText={setStartMovieQueryText}
                  options={startMovieOptions}
                  searchPlaceholder="Search for movie titles..."
                  selectionPlaceholder="Select starting movie"
                  isLoading={startMoviesLoading}
                  emptyResultsText="No movies found"
                  disabled={!!getValues("startPersonId")}
                />
              )}
            />
          </div>
          <div className="flex justify-center sm:justify-start">
            <Controller
              control={control}
              name="startPersonId"
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  open={startPersonOpen}
                  setOpen={setStartPersonOpen}
                  onSelectOption={(id) => {
                    onChange(id !== "" ? parseInt(id) : null);
                    updateQueryParams([
                      {
                        key: "startPerson",
                        value: id,
                      },
                    ]);
                  }}
                  value={value ? value.toString() : ""}
                  searchText={startPersonQueryText}
                  setSearchText={setStartPersonQueryText}
                  options={startPersonOptions}
                  searchPlaceholder="Search by name..."
                  selectionPlaceholder="Select starting actor/director/writer/etc."
                  isLoading={startPeopleLoading}
                  emptyResultsText="No people found"
                  disabled={!!getValues("startMovieId")}
                />
              )}
            />
          </div>
        </div>
        {!selectedStartMovie && !selectedStartPerson && (
          <ImagePlaceholder size="sm" noText />
        )}
        {selectedStartMovie?.poster_path ? (
          <TMDBImage slug={selectedStartMovie.poster_path} size="sm" />
        ) : selectedStartMovie ? (
          <ImagePlaceholder size="sm" />
        ) : null}
        {selectedStartPerson?.profile_path ? (
          <TMDBImage slug={selectedStartPerson.profile_path} size="sm" />
        ) : selectedStartPerson ? (
          <ImagePlaceholder size="sm" />
        ) : null}
      </div>
      <div className="mt-4 text-xl sm:text-2xl">
        {selectedStartMovie
          ? `${selectedStartMovie.title}${
              selectedStartMovie.release_date !== ""
                ? ` (${dayjs(selectedStartMovie.release_date).format("YYYY")})`
                : ""
            }`
          : selectedStartPerson
            ? selectedStartPerson.name
            : null}
      </div>
      <div className="mt-6 flex gap-4">
        <Button variant="ghost" onClick={clearStart}>
          Clear
        </Button>
        <Button variant="secondary" onClick={selectRandomStart}>
          Choose For Me
        </Button>
      </div>
      <div className="mt-12">
        <h2 className="text-4xl font-bold">Step 2: Choose a destination</h2>
      </div>
      <div className="mt-12 flex flex-wrap justify-center gap-8 sm:w-[600px] sm:flex-nowrap">
        <div className="flex flex-col justify-center gap-8">
          <div className="flex justify-center sm:justify-start">
            <Controller
              control={control}
              name="endMovieId"
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  open={endMovieOpen}
                  setOpen={setEndMovieOpen}
                  onSelectOption={(id) => {
                    onChange(id !== "" ? parseInt(id) : null);
                    updateQueryParams([
                      {
                        key: "endMovie",
                        value: id,
                      },
                    ]);
                  }}
                  value={value ? value.toString() : ""}
                  searchText={endMovieQueryText}
                  setSearchText={setEndMovieQueryText}
                  options={endMovieOptions}
                  searchPlaceholder="Search for movie titles..."
                  selectionPlaceholder="Select ending movie"
                  isLoading={endMoviesLoading}
                  emptyResultsText="No movies found"
                  disabled={!!getValues("endPersonId")}
                />
              )}
            />
          </div>
          <div className="flex justify-center sm:justify-start">
            <Controller
              control={control}
              name="endPersonId"
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  open={endPersonOpen}
                  setOpen={setEndPersonOpen}
                  onSelectOption={(id) => {
                    onChange(id !== "" ? parseInt(id) : null);
                    updateQueryParams([
                      {
                        key: "endPerson",
                        value: id,
                      },
                    ]);
                  }}
                  value={value ? value.toString() : ""}
                  searchText={endPersonQueryText}
                  setSearchText={setEndPersonQueryText}
                  options={endPersonOptions}
                  searchPlaceholder="Search by name..."
                  selectionPlaceholder="Select ending actor/director/writer/etc."
                  isLoading={endPeopleLoading}
                  emptyResultsText="No people found"
                  disabled={!!getValues("endMovieId")}
                />
              )}
            />
          </div>
        </div>
        {!selectedEndMovie && !selectedEndPerson && (
          <ImagePlaceholder size="sm" noText />
        )}
        {selectedEndMovie?.poster_path ? (
          <TMDBImage slug={selectedEndMovie.poster_path} size="sm" />
        ) : selectedEndMovie ? (
          <ImagePlaceholder size="sm" />
        ) : null}
        {selectedEndPerson?.profile_path ? (
          <TMDBImage slug={selectedEndPerson.profile_path} size="sm" />
        ) : selectedEndPerson ? (
          <ImagePlaceholder size="sm" />
        ) : null}
      </div>
      <div className="mt-4 text-xl sm:text-2xl">
        {selectedEndMovie
          ? `${selectedEndMovie.title}${
              selectedEndMovie.release_date !== ""
                ? ` (${dayjs(selectedEndMovie.release_date).format("YYYY")})`
                : ""
            }`
          : selectedEndPerson
            ? selectedEndPerson.name
            : null}
      </div>
      <div className="mt-6 flex gap-4">
        <Button variant="ghost" onClick={clearEnd}>
          Clear
        </Button>
        <Button variant="secondary" onClick={selectRandomEnd}>
          Choose For Me
        </Button>
      </div>
      <div className="mt-12">
        <h2 className="text-4xl font-bold">Step 3: Have fun!</h2>
      </div>
      <div className="mt-12 flex gap-4 pb-24">
        <Button
          variant="ghost"
          onClick={() => {
            navigator.clipboard
              .writeText(window.location.href)
              .then(() => {
                toast("Copied game link to clipboard!");
              })
              .catch(() => {
                toast("Something went wrong");
              });
          }}
        >
          Copy Game Link
        </Button>
        <Button disabled={!isValid} onClick={handleSubmit(onSubmit)}>
          Continue
        </Button>
      </div>
    </div>
  );
};
