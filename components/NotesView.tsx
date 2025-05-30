import { Note } from '@/lib/types'
import { Card,CardHeader,CardContent,CardTitle,CardFooter } from './ui/card';
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/lib/storage";
import { Button } from "./ui/button";
interface NotesViewProps{
    note: Note;
    onEdit: () => void;
}

function NotesView({ note,onEdit }:NotesViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{note.title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {formatDate(note.createdAt)}
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-350px)]">
          <div>{note.content}</div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={onEdit}>Edit Note</Button>
      </CardFooter>
    </Card>
  )
}

export default NotesView