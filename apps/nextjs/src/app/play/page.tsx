"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { Autocomplete } from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import { useDebouncedSearch } from "@/hooks/useDebounce";
import { api } from "@/trpc/react";

export default function CreateGamePage() {
  const [startMovieOpen, setStartMovieOpen] = useState(false);
  const [startMovieId, setStartMovieId] = useState<number | null>(null);
  const [startMovieOptions, setStartMovieOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [startMovieQueryText, setStartMovieQueryText] = useState("");
  const debouncedStartMovie = useDebouncedSearch(startMovieQueryText, 1000);

  const [startPersonOpen, setStartPersonOpen] = useState(false);
  const [startPersonId, setStartPersonId] = useState<number | null>(null);
  const [startPersonOptions, setStartPersonOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [startPersonQueryText, setStartPersonQueryText] = useState("");
  const debouncedStartPerson = useDebouncedSearch(startPersonQueryText, 1000);

  const [endMovieOpen, setEndMovieOpen] = useState(false);
  const [endMovieId, setEndMovieId] = useState<number | null>(null);
  const [endMovieOptions, setEndMovieOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [endMovieQueryText, setEndMovieQueryText] = useState("");
  const debouncedEndMovie = useDebouncedSearch(endMovieQueryText, 1000);

  const [endPersonOpen, setEndPersonOpen] = useState(false);
  const [endPersonId, setEndPersonId] = useState<number | null>(null);
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
      !newResults.some((result) => result.value === startMovieId?.toString())
    ) {
      setStartMovieId(null);
    }

    setStartMovieOptions(newResults);
  }, [startMovies, startMovieId]);

  useEffect(() => {
    const newResults =
      startPeople?.results.map(({ id, name }) => ({
        value: id.toString(),
        label: name,
      })) ?? [];

    if (
      !newResults.some((result) => result.value === startPersonId?.toString())
    ) {
      setStartPersonId(null);
    }

    setStartPersonOptions(newResults);
  }, [startPeople, startPersonId]);

  useEffect(() => {
    const newResults =
      endMovies?.results
        .filter(({ release_date }) => dayjs(release_date).isValid())
        .map(({ id, title, release_date }) => ({
          value: id.toString(),
          label: `${title} (${dayjs(release_date).format("YYYY")})`,
        })) ?? [];

    if (!newResults.some((result) => result.value === endMovieId?.toString())) {
      setEndMovieId(null);
    }

    setEndMovieOptions(newResults);
  }, [endMovies, endMovieId]);

  useEffect(() => {
    const newResults =
      endPeople?.results.map(({ id, name }) => ({
        value: id.toString(),
        label: name,
      })) ?? [];

    if (
      !newResults.some((result) => result.value === endPersonId?.toString())
    ) {
      setEndPersonId(null);
    }

    setEndPersonOptions(newResults);
  }, [endPeople, endPersonId]);
  return (
    <div className="container mt-12 flex flex-col items-center">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        Create Game
      </h1>
      <div className="mt-12">
        <Autocomplete
          open={startMovieOpen}
          setOpen={setStartMovieOpen}
          onSelectOption={(id) =>
            setStartMovieId(id !== "" ? parseInt(id) : null)
          }
          value={startMovieId ? startMovieId.toString() : ""}
          searchText={startMovieQueryText}
          setSearchText={setStartMovieQueryText}
          options={startMovieOptions}
          searchPlaceholder="Search for movie titles..."
          selectionPlaceholder="Select starting movie"
          isLoading={startMoviesLoading}
          emptyResultsText="No movies found"
        />
      </div>
      <div className="mt-12">
        <Autocomplete
          open={startPersonOpen}
          setOpen={setStartPersonOpen}
          onSelectOption={(id) =>
            setStartPersonId(id !== "" ? parseInt(id) : null)
          }
          value={startPersonId ? startPersonId.toString() : ""}
          searchText={startPersonQueryText}
          setSearchText={setStartPersonQueryText}
          options={startPersonOptions}
          searchPlaceholder="Search by name..."
          selectionPlaceholder="Select starting actor/director/writer/etc."
          isLoading={startPeopleLoading}
          emptyResultsText="No people found"
        />
      </div>
      <div className="mt-12">
        <Autocomplete
          open={endMovieOpen}
          setOpen={setEndMovieOpen}
          onSelectOption={(id) =>
            setEndMovieId(id !== "" ? parseInt(id) : null)
          }
          value={endMovieId ? endMovieId.toString() : ""}
          searchText={endMovieQueryText}
          setSearchText={setEndMovieQueryText}
          options={endMovieOptions}
          searchPlaceholder="Search for movie titles..."
          selectionPlaceholder="Select ending movie"
          isLoading={endMoviesLoading}
          emptyResultsText="No movies found"
        />
      </div>
      <div className="mt-12">
        <Autocomplete
          open={endPersonOpen}
          setOpen={setEndPersonOpen}
          onSelectOption={(id) =>
            setEndPersonId(id !== "" ? parseInt(id) : null)
          }
          value={endPersonId ? endPersonId.toString() : ""}
          searchText={endPersonQueryText}
          setSearchText={setEndPersonQueryText}
          options={endPersonOptions}
          searchPlaceholder="Search by name..."
          selectionPlaceholder="Select ending actor/director/writer/etc."
          isLoading={endPeopleLoading}
          emptyResultsText="No people found"
        />
      </div>
      <div className="mt-12">
        <Button
          onClick={() => {
            console.log({
              startPersonId,
              startMovieId,
              endPersonId,
              endMovieId,
            });
          }}
        >
          Start
        </Button>
      </div>
    </div>
  );
}
