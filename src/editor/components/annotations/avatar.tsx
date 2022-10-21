import React from "react";

type AvatarProps = {
  src: string
}


export const Avatar = (props: AvatarProps) => {
  const {
    src
  } = props;

  return (
    <div className={'annotation-popup__avatar'}>
      <img src={src} alt=""/>
    </div>
  );
}