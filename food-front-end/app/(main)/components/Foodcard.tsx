interface FoodcardProps {
  name: string;
  ingredients: string;
  price: string | number;
  image: string;
}
export const Foodcard = ({
  name,
  ingredients,
  price,
  image,
}: FoodcardProps) => {
  return (
    <div className="cursor-pointer flex w-[365px] h-[342px] overflow-hidden flex-col items-start gap-5 self-stretch p-4 rounded-[20px] bg-white">
      <div
        style={{
          backgroundImage: `url('${image}')`,
        }}
        className="min-h-[200px] w-full bg-cover bg-center rounded-xl flex justify-end items-end"></div>
      <div className="flex  flex-col items-start gap-2 self-stretch">
        <div className="flex justify-between items-center gap-[10px] self-stretch">
          <p className="text-[24px] text-[#EF4444] font-semibold">{name}</p>
          <p className="text-[18px] text-[#09090B] font-semibold">{price}₮</p>
        </div>
        <p className="text-[14px] text-[#09090B]">{ingredients}</p>
      </div>
    </div>
  );
};
