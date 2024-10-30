import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { InviteGuestsModal } from './invite-guests-modal'
import { ConfirmTripModal } from './confirm-trip-modal'
import { DestinationAndDateStep } from './steps/destination-and-date-step'
import { InviteGuestsStep } from './steps/invite-guests-step'
import { DateRange } from 'react-day-picker'
import { api } from '../../lib/axios'


export function CreateTripPage() {
    const navigate = useNavigate()

    const [isGuestsInputOpen, setIsGuestsInputOpen] = useState(false)
    const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false)
    const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false)
    
    const [destination, setDestination] = useState('')
    const [ownerName, setOwnerName] = useState('')
    const [ownerEmail, setOwnerEmail] = useState('')
    const [eventStartAndEndDates, setEventStartAndEndDates] = useState<DateRange | undefined>();
    const [emailsToInvite, setEmailsToInvite] = useState([''])

    function openGuestsInput() {
        setIsGuestsInputOpen(true)
    }

    function closeGuestsInput() {
        setIsGuestsInputOpen(false)
    }
    
    function openGuestsModal() {
        setIsGuestsModalOpen(true)
    }
    
    function closeGuestsModal() {
        setIsGuestsModalOpen(false)
    }

    function openConfirmTripModal() {
        setIsConfirmTripModalOpen(true)
    }

    function closeConfirmTripModal() {
        setIsConfirmTripModalOpen(false)
    }
    
    function addNewEmailOnInvite(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const data = new FormData(event.currentTarget)
        const email = data.get('email')?.toString()

        if (!email){
        return
        }

        if (emailsToInvite.includes(email)){
        return
        }

        setEmailsToInvite([
        ...emailsToInvite,
        email
        ])

        event.currentTarget.reset()
    }
    
    function removeEmailFromIvites(emailToRemove: string){
        const newEmailList = emailsToInvite.filter(email => email !== emailToRemove)
        setEmailsToInvite(newEmailList)
    }

    async function createTrip(event: FormEvent<HTMLFormElement>){
        event.preventDefault()

        console.log(destination)
        console.log(eventStartAndEndDates)
        console.log(emailsToInvite)
        console.log(ownerName)
        console.log(ownerEmail)


        //validacao basica
        if(!destination){
            return
        }

        if(!eventStartAndEndDates?.from || !eventStartAndEndDates.to){
            return
        }

        if(emailsToInvite.length === 0){
           return 
        }
        
        if(!ownerName || !ownerEmail){
            return
        } 

        const response = await api.post('/api/Trips', {
            destination: destination,
            starts_at: eventStartAndEndDates?.from,
            ends_at: eventStartAndEndDates?.to,
            email_to_invite: emailsToInvite,
            owner_name: ownerName,
            owner_email: ownerEmail
        })

        const { tripId } = response.data
        
        navigate(`/trip/${tripId}`)
    }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="max-w-3xl w-full px-6 text-center space-y-10">
        <p className="text-zinc-300 text-lg"> Convide seus amigos e planeje sua próxima viagem!  </p>
        <div className='space-y-4'>
            <DestinationAndDateStep 
            closeGuestsInput={closeGuestsInput}
            openGuestsInput={openGuestsInput}
            isGuestsInputOpen={isGuestsInputOpen}
            setDestination={setDestination}
            setEventStartAndEndDates={setEventStartAndEndDates}
            eventStartAndEndDates={eventStartAndEndDates}
            />
          

            {isGuestsInputOpen && (
                <InviteGuestsStep 
                emailsToInvite={emailsToInvite}
                openConfirmTripModal={openConfirmTripModal}
                openGuestsModal={openGuestsModal}
                />    
            )}
        </div>

        <p className="text-sm text-zinc-500"> 
          Ao planejar sua viagem pela plann.er você automaticamente concorda <br/> com nossos <a href="#" className="text-zinc-300 underline">termos de uso</a> e <a href="#" className="text-zinc-300 underline">politicas de privacidade</a>.
        </p>
      </div>


    {isGuestsModalOpen && (
        <InviteGuestsModal 
            emailsToInvite={emailsToInvite}
            removeEmailFromIvites={removeEmailFromIvites}
            addNewEmailOnInvite={addNewEmailOnInvite}
            closeGuestsModal={closeGuestsModal}
        />    
    )}

        {isConfirmTripModalOpen && (
          <ConfirmTripModal  
          closeConfirmTripModal={closeConfirmTripModal}
          createTrip={createTrip}
          setOwnerName={setOwnerName}
          setOwnerEmail={setOwnerEmail}
          />
        )}
    </div>
  )
}

