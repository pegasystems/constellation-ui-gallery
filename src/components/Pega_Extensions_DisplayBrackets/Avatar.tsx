import React, { useEffect, useState } from 'react';
import { Avatar as CosmosAvatar } from '@pega/cosmos-react-core';

interface PegaExtensionsDisplayBracketsAvatarProps {
  metaObj?: {
    ID?: string;
    name?: string;
    image?: string;
  };
  showStatus?: boolean;
}

function Avatar(props: PegaExtensionsDisplayBracketsAvatarProps) {
  const { metaObj, showStatus = false } = props;
  const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null);
  const [userState, setUserState] = useState<'active' | 'inactive'>('inactive');

  const environmentInfo = (window as any).PCore?.getEnvironmentInfo?.();

  const userName =
    metaObj?.name ??
    environmentInfo?.getOperatorName?.() ??
    metaObj?.ID ??
    environmentInfo?.getOperatorIdentifier?.() ??
    '';

  const userIdentifier = metaObj?.ID ?? environmentInfo?.getOperatorIdentifier?.() ?? '';

  useEffect(() => {
    const imageKey = metaObj?.image ?? environmentInfo?.getOperatorImageInsKey?.();
    if (!imageKey) {
      return;
    }

    (window as any).PCore?.getAssetLoader?.()
      ?.getSvcImage(imageKey)
      .then((blob: Blob) => URL.createObjectURL(blob))
      .then((imagePath: string) => setImageBlobUrl(imagePath))
      .catch(() => {
        setImageBlobUrl(null);
      });
  }, [metaObj, environmentInfo]);

  useEffect(() => {
    if (!showStatus || !userIdentifier) {
      return;
    }

    const presenceManager = (window as any).PCore?.getMessagingServiceManager?.().getUserPresence?.();
    if (!presenceManager) {
      return;
    }

    const currentState = presenceManager.getUserState(userIdentifier);
    setUserState(currentState === 'online' ? 'active' : 'inactive');

    const handleUserStateChange = ({ state }: { state: string }) => {
      setUserState(state === 'online' ? 'active' : 'inactive');
    };

    const subscriptionId = presenceManager.subscribe(userIdentifier, handleUserStateChange);

    return () => {
      presenceManager.unsubscribe(userIdentifier, subscriptionId);
    };
  }, [showStatus, userIdentifier]);

  // Do not render when userName does not exist
  if (!userName) {
    return null;
  }

  return (
    <CosmosAvatar
      name={userName}
      imageSrc={imageBlobUrl ?? undefined}
      status={showStatus && userState === 'active' ? 'active' : undefined}
    />
  );
}

export default Avatar;
