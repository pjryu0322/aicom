import React, { createContext, useContext, useMemo, useState } from 'react'
import { workflowSteps, mockMeetings, mockSpeakers } from '../../lib/mockData'
import { cx } from '../../lib/utils'
import FileList from './FileList'
import ParticipantList from './ParticipantList'
import TaskStatus from './TaskStatus'

const MeetingWorkspaceContext = createContext(null)

export function useMeetingWorkspace() {
  const ctx = useContext(MeetingWorkspaceContext)
  if (!ctx) throw new Error('useMeetingWorkspace must be used within MeetingWorkspaceProvider')
  return ctx
}

/**
 * Provides shared selection state for the meeting-workspace template.
 * This lets the left sidebar drive what the center panel shows.
 */
export function MeetingWorkspaceProvider({
  children,
  meetings = mockMeetings,
  speakers = mockSpeakers,
  steps = workflowSteps,
  initialSelection,
}) {
  const defaultSelection =
    initialSelection ??
    (meetings?.[0]?.id
      ? { kind: 'meeting', id: meetings[0].id }
      : speakers?.[0]?.id
        ? { kind: 'speaker', id: speakers[0].id }
        : steps?.[0]?.id
          ? { kind: 'step', id: steps[0].id }
          : { kind: 'meeting', id: null })

  const [selection, setSelection] = useState(defaultSelection)

  const value = useMemo(
    () => ({
      meetings,
      speakers,
      steps,
      selection,
      setSelection,
    }),
    [meetings, speakers, steps, selection],
  )

  return <MeetingWorkspaceContext.Provider value={value}>{children}</MeetingWorkspaceContext.Provider>
}

export default function Sidebar({ className = '' }) {
  const { meetings, speakers, steps, selection, setSelection } = useMeetingWorkspace()

  return (
    <div className={cx('space-y-3', className)}>
      <FileList
        meetings={meetings}
        selection={selection}
        onSelectMeeting={(id) => setSelection({ kind: 'meeting', id })}
      />
      <ParticipantList
        speakers={speakers}
        selection={selection}
        onSelectSpeaker={(id) => setSelection({ kind: 'speaker', id })}
      />
      <TaskStatus steps={steps} selection={selection} onSelectStep={(id) => setSelection({ kind: 'step', id })} />
    </div>
  )
}
