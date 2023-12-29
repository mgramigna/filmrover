import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
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

export const CreateGameForm = ({
  onSubmit,
}: {
  onSubmit: (form: CreateGameFormType) => void;
}) => {
  const {
    formState: { isValid },
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
  } = useForm<CreateGameFormType>({
    resolver: zodResolver(CreateGameFormSchema),
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

  const { data: popularMovies } = api.movie.getPopularList.useQuery({});
  const { data: popularPeople } = api.person.getPopularList.useQuery({});

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
  }, [setValue]);

  const clearEnd = useCallback(() => {
    setValue("endMovieId", undefined, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("endPersonId", undefined, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [setValue]);

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
    if (!(popularMovies && popularPeople)) return;

    const randomStartType = Math.random() < 0.5 ? "movie" : "person";

    const randomArray =
      randomStartType === "movie"
        ? popularMovies.results
        : popularPeople.results;

    const randomChoice =
      randomArray[Math.floor(Math.random() * randomArray.length)];

    if (randomStartType === "movie") {
      setValue("startMovieId", randomChoice?.id, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("startPersonId", undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      setValue("startMovieId", undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("startPersonId", randomChoice?.id, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [popularMovies, popularPeople, setValue]);

  const selectRandomEnd = useCallback(() => {
    if (!(popularMovies && popularPeople)) return;

    const randomEndType = Math.random() < 0.5 ? "movie" : "person";

    const randomArray =
      randomEndType === "movie" ? popularMovies.results : popularPeople.results;

    const randomChoice =
      randomArray[Math.floor(Math.random() * randomArray.length)];

    if (randomEndType === "movie") {
      setValue("endMovieId", randomChoice?.id, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("endPersonId", undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      setValue("endMovieId", undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("endPersonId", randomChoice?.id, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [popularMovies, popularPeople, setValue]);

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
                  onSelectOption={(id) =>
                    onChange(id !== "" ? parseInt(id) : null)
                  }
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
                  onSelectOption={(id) =>
                    onChange(id !== "" ? parseInt(id) : null)
                  }
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
          ? selectedStartMovie.title
          : selectedStartPerson
            ? selectedStartPerson.name
            : null}
      </div>
      <div className="mt-6 flex gap-4">
        <Button variant="ghost" onClick={clearStart}>
          Clear
        </Button>
        <Button
          variant="secondary"
          onClick={selectRandomStart}
          disabled={!(popularMovies && popularPeople)}
        >
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
                  onSelectOption={(id) =>
                    onChange(id !== "" ? parseInt(id) : null)
                  }
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
                  onSelectOption={(id) =>
                    onChange(id !== "" ? parseInt(id) : null)
                  }
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
          ? selectedEndMovie.title
          : selectedEndPerson
            ? selectedEndPerson.name
            : null}
      </div>
      <div className="mt-6 flex gap-4">
        <Button variant="ghost" onClick={clearEnd}>
          Clear
        </Button>
        <Button
          variant="secondary"
          disabled={!(popularMovies && popularPeople)}
          onClick={selectRandomEnd}
        >
          Choose For Me
        </Button>
      </div>
      <div className="mt-12">
        <h2 className="text-4xl font-bold">Step 3: Have fun!</h2>
      </div>
      <div className="mt-12 pb-24">
        <Button disabled={!isValid} onClick={handleSubmit(onSubmit)}>
          Continue
        </Button>
      </div>
    </div>
  );
};
