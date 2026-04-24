import { NavLink, Route, Routes } from 'react-router-dom'
import GenericCrudPage from './components/GenericCrudPage'
import { moduleConfigs } from './config/modules'
import DashboardPage from './pages/DashboardPage'
import FamilyPage from './pages/FamilyPage'

function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <header style={{ padding: 16, borderBottom: '1px solid #e5e7eb', backgroundColor: '#f8fafc' }}>
        <h1 style={{ margin: '0 0 12px' }}>Datastore</h1>
        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <NavLink to="/">Dashboard</NavLink>
          {moduleConfigs.map((module) => (
            <NavLink key={module.path} to={module.path}>
              {module.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<DashboardPage />} />
        {moduleConfigs.map((module) =>
          module.implemented ? (
            <Route key={module.path} path={module.path} element={<FamilyPage />} />
          ) : (
            <Route
              key={module.path}
              path={module.path}
              element={
                <GenericCrudPage
                  title={module.label}
                  apiPath={module.apiPath}
                  tableColumns={module.tableColumns || []}
                  formFields={module.formFields || []}
                  familyMemberField={module.familyMemberField}
                  searchKeys={module.searchKeys || []}
                  uploadOnly={module.uploadOnly || false}
                />
              }
            />
          ),
        )}
      </Routes>
    </div>
  )
}

export default App