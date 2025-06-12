import {DndContext} from "@dnd-kit/core";
import {Sidebar} from "./Sidebar.jsx";
import {EventForm} from "./EventForm.jsx";

export const Editor = () => {
    return <main style={{display: 'flex', flexDirection: 'row', flex: 1}}>
        <DndContext>
            <Sidebar/>
            <EventForm device={{name: 'Beamer Left', id: 1, channel: 0}}/>
        </DndContext>
    </main>
}