import NoteForm from "@/components/NoteForm";
import NoteList from "@/components/NoteList";
import SearchBar from "@/components/SearchBar";
import TagFilter from "@/components/TagFilter";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-8">
      <h1 className="text-3xl font-bold">AI Notes & Tasks</h1>
      <NoteForm />
      <div className="space-y-3">
        <SearchBar />
        <TagFilter />
      </div>
      <NoteList />
    </main>
  );
}
