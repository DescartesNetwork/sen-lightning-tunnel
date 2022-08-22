import { Fragment, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from 'model'
import { getMetaData, initMetadatas, ipfs } from 'model/metadatas.controller'
import { useGetBackupMetadata } from 'hooks/metadata/useGetBackupMetadata'
import { setMetadataLoading } from 'model/main.controller'

const MetadatasWatcher = ({
  updateStatus,
}: {
  updateStatus: (status: boolean) => void
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [initialized, setInitialized] = useState(false)
  const distributors = useSelector((state: AppState) => state.distributors)
  const getBackupMetadata = useGetBackupMetadata()

  const watchData = useCallback(async () => {
    if (!initialized) return
    for (const { metadata } of Object.values(distributors)) {
      const cid = ipfs.decodeCID(metadata)
      dispatch(getMetaData({ cid }))
    }
    return dispatch(setMetadataLoading(false))
  }, [dispatch, distributors, initialized])

  useEffect(() => {
    const timeout = setTimeout(() => watchData(), 1000)
    return () => clearTimeout(timeout)
  }, [dispatch, watchData])

  // Fetch all metadata
  const init = useCallback(async () => {
    const backupMetadata = await getBackupMetadata()
    dispatch(initMetadatas(backupMetadata))
    updateStatus(false)
    return setInitialized(true)
  }, [dispatch, getBackupMetadata, updateStatus])

  useEffect(() => {
    init()
  }, [init])

  return <Fragment />
}

export default MetadatasWatcher
