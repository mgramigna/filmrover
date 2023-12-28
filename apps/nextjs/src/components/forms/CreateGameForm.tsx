import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Autocomplete } from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import { useDebouncedSearch } from "@/hooks/useDebounce";
import { api } from "@/trpc/react";

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

  useEffect(() => {
    const newResults =
      startMovies?.results
        .filter(({ release_date }) => dayjs(release_date).isValid())
        .map(({ id, title, release_date }) => ({
          value: id.toString(),
          label: `${title} (${dayjs(release_date).format("YYYY")})`,
        })) ?? [];

    if (
      !newResults.some(
        (result) => result.value === currentStartMovieId?.toString(),
      )
    ) {
      setValue("startMovieId", undefined);
    }

    setStartMovieOptions(newResults);
  }, [currentStartMovieId, setValue, startMovies]);

  useEffect(() => {
    const newResults =
      startPeople?.results.map(({ id, name }) => ({
        value: id.toString(),
        label: name,
      })) ?? [];

    if (
      !newResults.some(
        (result) => result.value === currentStartPersonId?.toString(),
      )
    ) {
      setValue("startPersonId", undefined);
    }

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

    if (
      !newResults.some(
        (result) => result.value === currentEndMovieId?.toString(),
      )
    ) {
      setValue("endMovieId", undefined);
    }

    setEndMovieOptions(newResults);
  }, [currentEndMovieId, setValue, endMovies]);

  useEffect(() => {
    const newResults =
      endPeople?.results.map(({ id, name }) => ({
        value: id.toString(),
        label: name,
      })) ?? [];

    if (
      !newResults.some(
        (result) => result.value === currentEndPersonId?.toString(),
      )
    ) {
      setValue("endPersonId", undefined);
    }

    setEndPersonOptions(newResults);
  }, [endPeople, currentEndPersonId, setValue]);

  return (
    <div className="container flex flex-col items-center">
      <div className="mt-12">
        <Controller
          control={control}
          name="startMovieId"
          render={({ field: { value, onChange } }) => (
            <Autocomplete
              open={startMovieOpen}
              setOpen={setStartMovieOpen}
              onSelectOption={(id) => onChange(id !== "" ? parseInt(id) : null)}
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
      <div className="mt-12">
        <Controller
          control={control}
          name="startPersonId"
          render={({ field: { value, onChange } }) => (
            <Autocomplete
              open={startPersonOpen}
              setOpen={setStartPersonOpen}
              onSelectOption={(id) => onChange(id !== "" ? parseInt(id) : null)}
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
      <div className="mt-12">
        <Controller
          control={control}
          name="endMovieId"
          render={({ field: { value, onChange } }) => (
            <Autocomplete
              open={endMovieOpen}
              setOpen={setEndMovieOpen}
              onSelectOption={(id) => onChange(id !== "" ? parseInt(id) : null)}
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
      <div className="mt-12">
        <Controller
          control={control}
          name="endPersonId"
          render={({ field: { value, onChange } }) => (
            <Autocomplete
              open={endPersonOpen}
              setOpen={setEndPersonOpen}
              onSelectOption={(id) => onChange(id !== "" ? parseInt(id) : null)}
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
      <div className="mt-12">
        <Button disabled={!isValid} onClick={handleSubmit(onSubmit)}>
          Start
        </Button>
      </div>
    </div>
  );
};
