import React from 'react'
import TournamentItem from './TournamentItem'

const ListTournament = ({items = []}: any) => {
  return (
    <div>
        <div className="grid md:grid-cols-4 grid-cols-1 gap-5">
            {items.map((item: any) => (
                <TournamentItem key={item.id} item={item} />
            ))}
        </div>
    </div>
  )
}

export default ListTournament