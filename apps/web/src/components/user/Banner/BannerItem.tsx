interface BannerItemProps {
  imageUrl: string;
}

const BannerItem = ({ imageUrl }: BannerItemProps) => {
  return (
    <div className="w-full h-[173px] sm:h-[80px] md:h-[120px] lg:h-[150px] xl:h-[180px] 2xl:h-[200px]">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Banner"
          className="w-full h-full object-cover rounded-lg sm:rounded-xl"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full rounded-lg sm:rounded-xl bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No Banner</span>
        </div>
      )}
    </div>
  );
};

export default BannerItem;
