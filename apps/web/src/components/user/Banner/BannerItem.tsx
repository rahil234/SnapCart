interface BannerItemProps {
  imageUrl: string;
}

const BannerItem = ({ imageUrl }: BannerItemProps) => {
  return (
    <div className="flex-shrink-0 w-full h-[180px] sm:h-[200px] md:h-[240px] lg:h-[280px] xl:h-[320px]">
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
