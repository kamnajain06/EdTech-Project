import React from 'react'
import HighlightedText from './HighlightedText'
import know from "../../../assets/Images/Know_your_progress.png"
import compare from "../../../assets/Images/Compare_with_others.png"
import plan from "../../../assets/Images/Plan_your_lessons.png"
import CTAButton from './CTAButton'

const LearningLanguageSection = () => {
  return (
    <div className='mt-[150px] w-screen mb-[150px] '>
      <div className='w-11/12 flex flex-col items-center justify-center mx-auto '>
        <div className='text-4xl font-bold'>
          Your Swiss Knife for <HighlightedText text={"learning any language"}></HighlightedText>
        </div>
        <div className='text-md mt-[10px] text-wrap text-center'>
        Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
        </div>
        <div className='w-11/12 flex mt-[80px] flex-row relative z-0 mt-[30px] h-[600px]'>
          <img src={know} className="absolute z-[-1] left-[-10px]"></img>
          <img src={plan} className="absolute right-[50px] z-20"></img>
          <img src={compare} className="absolute z-10 left-[310px]"></img>
        </div>
        <CTAButton text={"Learn More"} active={true} className='absolute w-3/4 mt-[100px]'></CTAButton>
      </div>
    </div>
  )
}

export default LearningLanguageSection