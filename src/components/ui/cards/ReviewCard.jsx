import Image from "next/image";
import FlexContainer from "@/components/common/FlexContainer";

const ReviewCard = ({ review }) => (
  <FlexContainer className="rounded-[20px] text-center lg:text-left overflow-hidden flex-col h-[770px] lg:flex-row lg:max-h-[360px]">
    <div className="w-full  lg:max-w-[608px] relative ">
      <div className="max-h-[306px] overflow-hidden lg:max-h-[360px] h-full ">
        <Image
          src={review.image}
          alt={review.name}
          width={800}
          height={500}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="w-full h-full object-cover object-center"
        />
      </div>
    </div>

    <div className="w-full bg-bgBlue p-6">
      <div className="text-text2 text-button sm:text-[32px] text-[32px] mb-3">
        “{review.title}”
      </div>
      <p className="text-base text-text mb-[40px] whitespace-pre-line ">
        {review.text}
      </p>
      <p className="text-title font-semibold mb-2 text-button sm:text-h3 font-regular">
        {review.name}
      </p>
      <p className="text-base">{review.location}</p>
    </div>
  </FlexContainer>
);

export default ReviewCard;
