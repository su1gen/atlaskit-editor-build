import React from "react";

type AvatarProps = {
  avatarSrc: string,
  isAvatarLink: boolean,
  userName: string,
}

const renderAvatarContent = (isAvatarLink: boolean, avatarSrc: string, userName: string) => {
  if(isAvatarLink)
    return <img src={avatarSrc} alt=""/>
  return <span>{userName[0].toUpperCase()}</span>;
}


export const UserAvatar = (props: AvatarProps) => {
  const {
    avatarSrc,
    isAvatarLink,
    userName,
  } = props;

  return (
    <div className={'annotation-popup__user-avatar'}>
      {renderAvatarContent(isAvatarLink, avatarSrc, userName)}
    </div>
  );
}