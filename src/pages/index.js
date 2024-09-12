import Image from "next/image";
import localFont from "next/font/local";
import Head from "next/head";
import EmotionDialog from "@/components/global/emotion_dialog";
import { useEffect, useState } from "react";

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState([]);
  const [message, setMessage] = useState("");

  const [threads, setThreads] = useState("");
  const [listMessageAll, setListMessageAll] = useState([]);

  const openDialog = () => {
    console.log("open dialog");
    setIsDialogOpen(true);
  };

  useEffect(() => {
    // check if threads is empty from local storage
    localStorage.getItem("threads") ? setThreads(localStorage.getItem("threads")) : setThreads("");
    // check if threads is empty from local storage
    localStorage.getItem("threads") ? getMessages() : setListMessageAll([]);
  }, []);

  const createThread = async () => {
    const response = await fetch("/api/thread", {
      method: "POST",
    });
    const data = await response.json();
    setThreads(data.id);
    localStorage.setItem("threads", data.id);

  }

  const sendMessage = async (e) => {
    e.preventDefault();
    const payloadMessage = message;
    // add message to list message
    const list = listMessageAll;
    list.push({
      role: "user",
      content: [
        {
          text: {
            value: message
          }
        }
      ]
    });
    setListMessageAll(list);
    setMessage("");

    // push loading message to list message Assistant
    const listAssistant = listMessageAll;
    listAssistant.push({
      role: "assistant",
      content: [
        {
          text: {
            value: "Loading"
          }
        }
      ]
    });
    setListMessageAll(listAssistant);

    // send message to assistant
    const threadId = localStorage.getItem("threads");
    const stream = await fetch("/api/assistant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        threadId: threadId,
        message: payloadMessage
      })
    });

    const reader = stream.body.getReader();
    const decoder = new TextDecoder();
    let result = "";
    let done = false;
    while (!done) {
      console.log("loading decode");
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      result += decoder.decode(value, { stream: true });
    }
    if (result) {
      // encode result to json
      if (result.includes("data:")) {
        const list = result.split("data:");
        for (let i = 1; i < list.length; i++) {
          console.log("loading");
          const data = JSON.parse(list[i]);
          if (data.event === "thread.run.completed") {
            getMessages();
          }
        }
      }
    }
  }

  const getMessages = async () => {
    const threadsId = localStorage.getItem("threads");
    const ress = await fetch(`/api/chat?threadId=${threadsId}`, {
      method: "GET"
    });
    const data = await ress.json();
    let listMessage = [];
    data.map((message) => {
      listMessage.push({
        role: message.role,
        content: message.content
      });
    })

    setListMessageAll(listMessage);

  }



  const closeDialog = () => setIsDialogOpen(false);
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <main>
        <div className="flex flex-col h-[84vh]">
          {/* Layout Conversation with bot */}
          <div className="flex-1">
            {
              threads != "" ? (
                <div className="flex flex-col gap-5 p-10 h-[75vh] overflow-y-auto max-md:p-5">
                  {
                    listMessageAll.map((message, index) => {
                      return (
                        <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                          <div className={`flex ${message.role === "user" ? "flex-row-reverse" : "flex"} max-w-[40rem] gap-5`}>
                            <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center border p-3 max-sm:w-[35px] max-sm:h-[35px] max-md:p-1">
                              <Image src={message.role === "user" ? '/assets/icons/user.svg' : '/assets/icons/logo.png'} alt="user" width={0} height={0} sizes="100%" className="w-full h-full" />
                            </div>
                            <div className={`w-fit p-5 rounded-lg max-md:p-4 ${message.role === "user" ? "bg-black text-white" : "bg-gray-200"}`}>
                              {
                                message.content.map((content, index) => {
                                  return (
                                    <p key={index} className="max-md:text-sm">{content.text.value}</p>
                                  )
                                })
                              }
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>

              ) : (
                <div className="my-32">
                  <p className="text-center text-2xl font-bold">Selamat datang di FizzMate!</p>
                  <p className="text-center text-lg">Mulai percakapan dengan Fizz</p>
                  <p className="text-center text-gray-400 ">Ceritakan perasaanmu hari ini!</p>
                </div>
              )
            }
          </div>

          {/* Layout input */}
          {
            threads != ""
              ? (
                <form onSubmit={sendMessage} className="flex items-center gap-3 w-full h-[80px] px-10 max-md:px-5">
                  <input type="text" value={message} placeholder="Type a message" className="w-full p-3 border-2 border-gray-200 rounded-lg max-md:w-[80%]" onChange={(e) => setMessage(e.target.value)} />
                  <button type="submit" className="flex items-center justify-center w-[50px] h-[50px] border rounded-lg bg-black">
                    <Image src="/assets/icons/send.svg" alt="emoji" width={20} height={20} />
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-center w-full h-[80px] px-10 max-md:px-5">
                  <button type="button" className="flex items-center justify-center h-[50px] border rounded-lg bg-black w-full" onClick={createThread}>
                    <p className="text-white">Mulai Percakapan</p>
                  </button>
                </div>
              )
          }
        </div>
        <EmotionDialog isOpen={isDialogOpen} onClose={closeDialog} selectedEmotionCallback={setSelectedEmotion} selectedEmotion={selectedEmotion} />
      </main>
    </>
  );
}
