import { FormEvent, useState } from "react"
import { toast, ToastContainer } from "react-toastify"


function Contact() {
    const [username, setUsername] = useState<string>()
    const [email, setEmail] = useState<string>()
    const [message, setMessage]= useState<string>()



    const handleSubmit = async(event:FormEvent<HTMLElement>)=>{
        event.preventDefault()
        try {
            if(!username ||! email?.includes("@") ||!message){
                return toast.error("Veuillez renseigner  tous  les champs ou  entrez une addresse  email  correcte ! ")
            }
            
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div className="h-screen">
         <div className="flex justify-center">
            <span className="text-red-500  font-bold  text-2xl text-center ">Contacts</span>
         </div>
        
        <div>

            <form action="#">
<div className="flex flex-col justify-center  items-center">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-xl">
            <h2 className="text-2xl font-bold text-red-700 mb-4 text-center">
               Entrer  vos  informations  pour  et details  pour nous  contacter 
            </h2>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
              className="border p-3 rounded-lg w-full mb-4 focus:ring-2 focus:ring-red-500"
            />
            <input
              type="email"
              name="Email"
              placeholder="Taper votre  Email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="border p-3 rounded-lg w-full mb-6 focus:ring-2 focus:ring-red-500"
            />

            <textarea
             value={message}
              onChange={(e)=>setMessage(e.target.value)}
            
            className="border p-3 rounded-lg w-full mb-6 focus:ring-2 focus:ring-red-500"
             rows={3}>
             
            </textarea>
            <button
              onClick={handleSubmit}
              className="bg-red-600 text-white py-3 rounded-lg font-semibold w-full hover:bg-red-700"
            >Contacts</button>
            </div>
            </div>
            </form>
        </div>
         <ToastContainer/>
  </div>
  )
}

export default Contact