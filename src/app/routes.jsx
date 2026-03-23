import useStore from '../store/appStore.js'
import Dashboard from '../features/dashboard/Dashboard.jsx'
import AIPage from '../features/ai/AIPage.jsx'

// Lazy-load heavier pages
import { lazy, Suspense } from 'react'
const FocusPage    = lazy(()=>import('../features/focus/FocusPage.jsx'))
const ProgressPage = lazy(()=>import('../features/progress/ProgressPage.jsx'))
const ProfilePage  = lazy(()=>import('../features/profile/ProfilePage.jsx'))
const ErrorsPage   = lazy(()=>import('../features/errors/ErrorsPage.jsx'))
const AnalyticsPage= lazy(()=>import('../features/analytics/AnalyticsPage.jsx'))
const PlanPage     = lazy(()=>import('../features/plan/PlanPage.jsx'))

const Loading = () => <div style={{padding:40,textAlign:'center',color:'var(--mt)'}}>Loading...</div>

export default function Routes() {
  const { page } = useStore()
  return(
    <Suspense fallback={<Loading/>}>
      {page==='dashboard'  && <Dashboard/>}
      {page==='plan'       && <PlanPage/>}
      {page==='focus'      && <FocusPage/>}
      {page==='ai'         && <AIPage/>}
      {page==='errors'     && <ErrorsPage/>}
      {page==='analytics'  && <AnalyticsPage/>}
      {page==='progress'   && <ProgressPage/>}
      {page==='profile'    && <ProfilePage/>}
    </Suspense>
  )
}
