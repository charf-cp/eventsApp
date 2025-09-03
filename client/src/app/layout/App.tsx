import { Box, Container, CssBaseline } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react"
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/ActivityDashboard";

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios.get<Activity[]>('http://localhost:5001/api/activities').then(response => setActivities(response.data))
    // fetch('http://localhost:5001/api/activities').then(Response=>Response.json()).then(data => setActivities(data))

  }, [])

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.find(x => x.id === id));
  }

  const handleCancelSelectActivity = () => {
    setSelectedActivity(undefined);
  }

  const handleOpenForm = (id?: string) => {

    if (id) handleSelectActivity(id);
    else handleCancelSelectActivity();
    setEditMode(true);
  }

  const handleFormClose = () => {
    setEditMode(false);
  }

  const handleSubmitForm = (activity: Activity) => {
    if (activity.id) {// handle edit (already have id)/ create new activity(no id yet ) 
      setActivities(activities.map(x => x.id === activity.id ? activity : x))
    } else {
      const newActivity = {...activity, id: activities.length.toString() };
      setSelectedActivity(newActivity)
      setActivities([...activities, newActivity ])
    }
    setEditMode(false);
  }

  const handleDeleteActivity= (id:string)=> {
    setActivities(activities.filter(x=>x.id!==id))
  }

  return (
    <Box sx={{ bgcolor: '#eeeeee' }}>
      <CssBaseline />
      <NavBar openForm={handleOpenForm} />
      <Container maxWidth="xl" sx={{ marginTop: 3 }}>
        {/* <Typography
          variant='h3'
          sx={{
            fontWeight: 700,          // bold
            color: 'primary.main',    // uses theme primary color
            mb: 3,                    // margin bottom
            textAlign: 'center',      // center the text
            letterSpacing: 1          // small spacing between letters
          }}
        >
          Reactivities
        </Typography> */}
        <ActivityDashboard
          activities={activities}
          selectActivity={handleSelectActivity}
          cancelSelectActivity={handleCancelSelectActivity}
          selectedActivity={selectedActivity}
          editMode={editMode}
          openForm={handleOpenForm}
          closeForm={handleFormClose}
          submitForm={handleSubmitForm}
          deleteActivity={handleDeleteActivity}
        />
      </Container>

    </Box>
  )
}

export default App
