import Image from "next/image";
import React from "react";
interface propsType {
  nama?: string;
  email?: string;
}

async function CardProfile(props: propsType) {
  // const session = await getSession();

  return (
    <>
      <div className="w-full grid grid-cols-8 bg-gray-200 rounded-lg mb-2 p-2">
        <div className="col-span-2">
          <Image
            src={"/profile.png"}
            alt={"Profile"}
            height={100}
            width={100}
          />
        </div>
        <div className="col-span-6">
          <div className="flex flex-col">
            <p className="text-lg font-bold">{props.nama}</p>
            <p>{props.email}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default CardProfile;
