import React, { useEffect } from 'react'
import maleVideo from '../assets/Videos/male-ai.mp4'
import femaleVideo from '../assets/Videos/female-ai.mp4'
import Timer from './Timer'
import { motion } from 'framer-motion'
import { FaMicrophone } from 'react-icons/fa'

const Step2Interview = ({ interviewData, onFinish }) => {
  const {interviewId, questions, userName} = interviewData
  const [isIntroPhase, setIsIntroPhase] = React.useState(true)

  const [isMicOn, setIsMicOn] = React.useState(false)
  const recognitionRef = React.useRef(null)
  const [isAIPlaying, setIsAIPlaying] = React.useState(false)

  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [answer, setAnswer] = React.useState('')
  const [feedback, setFeedback] = React.useState('')
  const [timeLeft, setTimeLeft] = React.useState(questions[0]?.timeLimit || 60)

  const [selectedVoice, setSelectedVoice] = React.useState(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [voiceGender, setVoiceGender] = React.useState("female")
  const [subtitle, setSubtitle] = React.useState("")
  
  const videoRef = React.useRef(null)

  const currentQuestion = questions[currentIndex]

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      if(!voices.length) return;

      const femaleVoice = voices.find(voice => voice.name.toLowerCase().includes('zira') || voice.name.toLowerCase().includes('samantha') || voice.name.toLowerCase().includes('female'))
      
      if(femaleVoice) {
        setSelectedVoice(femaleVoice)
        setVoiceGender("female")
        return;
      }
      
      const maleVoice = voices.find(voice => voice.name.toLowerCase().includes('david') || voice.name.toLowerCase().includes('mark') || voice.name.toLowerCase().includes('male'))
      if(maleVoice) {
        setSelectedVoice(maleVoice)
        setVoiceGender("male")
      }

      setSelectedVoice(voices[0])
      setVoiceGender("female")
    }
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
  }, [currentIndex])

  const videoSource = voiceGender === "female" ? femaleVideo : maleVideo

  const speakTest = (text) => {
    return new Promise((resolve) => {
      if(!selectedVoice || !window.speechSynthesis) {
        resolve();
        return;
      }
      window.speechSynthesis.cancel();
      
      const humanText = text.replace(/,/g, ', ...').replace(/\./g, '. ...');

      const utterance = new SpeechSynthesisUtterance(humanText);
      utterance.voice = selectedVoice;
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1.0;
      
      utterance.onstart = () => {
        setIsAIPlaying(true);
        videoRef.current?.play();
      };

      utterance.onend = () => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
        setIsAIPlaying(false);
      };

      setTimeout(() => {
        setSubtitle("");
        resolve();
      }, 300);

      setSubtitle(text);

      window.speechSynthesis.speak(utterance);
    });
  }

  useEffect(() => {
    if(!selectedVoice) return;

    const runIntro = async () => {
      if(isIntroPhase) {
        await speakTest(`Hi${userName}, it's great to meet you today. I hope you're feeling confident and ready to showcase your skills.`);

        await speakTest(
          "I'll ask you a few questions. Just answer naturally, and take your time. Let's begin."
        )

        setIsIntroPhase(false);
      }
      else if(currentQuestion) {
        await new Promise(r=>setTimeout(r, 800));

        if(currentIndex === questions.length - 1) {
          await speakTest("Alright, this one might be a bit more challenging.");
        }

        await speakTest(currentQuestion.question);
      }
    };

    runIntro();

  }, [selectedVoice,isIntroPhase,currentIndex]);

  return (
    <div className='min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-100 flex items-center justify-center p-4 sm:p-6'>
      <div className='w-full max-w-350 min-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col lg:flex-row overflow-hidden'>
        {/* video section */}
        <div className='w-full lg:w-[35%] bg-white flex flex-col items-center p-6 space-y-6 border-r border-gray-200'>
          <div className='w-full max-w-md rounded-2xl overflow-hidden shadow-xl'>
            <video src={videoSource} key={videoSource} ref={videoRef} muted playsInline preload='auto' className='w-full h-auto object-cover' />
          </div>
          {/* subtitle  */}
            {
              subtitle && (
                <div className='w-full max-w-md bg-gray-50 border border-gray-200 rounded-xl shadow-sm p-4'>
                  <p className='text-gray-700 text-sm sm:text-base font-medium text-center leading-relaxed'>{subtitle}</p>
                </div>
              )
            }
          {/* timer area */}
          <div className='w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-5'>
            <div className='flex items-center justify-between'>
              <span className='text-gray-500 text-sm'>Interview Status</span>
              {isAIPlaying && <span className='text-sm font-semibold text-emerald-600'>{isAIPlaying ? 'AI Speaking' : ''}</span>}
            </div>
            <div className='h-px bg-gray-200'></div>
            <div className='flex justify-center'>
              <Timer timeLeft={30} totalTime={60} />
            </div>
            <div className='h-px bg-gray-200'></div>
            <div className='grid grid-cols-2 gap-6 text-center'>
              <div>
                <span className='text-2xl font-bold text-emerald-600'>{currentIndex + 1}</span>
                <span className='text-gray-400 text-xs'>Current Question</span>
              </div>
              <div>
                <span className='text-2xl font-bold text-emerald-600'>{questions.length}</span>
                <span className='text-gray-400 text-xs'>Total Questions</span>
              </div>
            </div>
          </div>
        </div>
        {/* text section */}
        <div className='flex flex-1 flex-col p-4 sm:p-6 md:p-8 relative'>
          <h2 className='text-xl sm:text-2xl font-bold text-emerald-600 mb-6'>AI Smart Interview</h2>
          <div className='relative mb-6 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm'>
            <p className='text-xs sm:text-sm text-gray-400 mb-2'>
              Question {currentIndex + 1} of {questions.length}
            </p>
            <div className='text-base sm:text-lg leading-relaxed text-gray-800 font-semibold pr-16'>
              <p>{currentQuestion?.question}</p>
            </div>
          </div>
          <textarea placeholder='Type your answer here...' className='flex-1 bg-gray-100 p-4 sm:p-6 rounded-2xl resize-none outline-none border border-gray-200 focus:ring-2 focus:ring-emerald-500 transition text-gray-800' />
          <div className='flex items-center mt-6 gap-4'>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className='w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-black text-white shadow-lg'
             >
              <FaMicrophone size={20} />
            </motion.button>
              <motion.button
              whileTap={{ scale: 0.9 }}
              className='flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-2xl py-3 sm:py-4 shadow-lg hover:opacity-90 transition font-semibold'
              >
                Submit Answer
              </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step2Interview
