import { useCallback, useEffect, useMemo, useState } from 'react'
import { useUI } from '@sentre/senhub'

import { Button, Card, Col, Row, Space, Table, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import FilterReceiveList from 'components/filterReceiveList'
import ListReceiveMobile from 'components/listReceiveMobile'
import LoadMetadata from '../loadMetadata'

import { State } from '../../../constants'
import { TypeDistribute } from 'model/main.controller'
import { COLUMNS_RECEIVE } from '../columns'
import useStatus from 'hooks/useStatus'
import { ReceiveItem, useReceivedList } from 'hooks/useReceivedList'

const DEFAULT_AMOUNT = 4

const AirdropReceive = () => {
  const [amountAirdrop, setAmountAirdrop] = useState(DEFAULT_AMOUNT)
  const [listAirdrop, setListAirdrop] = useState<ReceiveItem[]>([])
  const listReceived = useReceivedList({ type: TypeDistribute.Airdrop })
  const [filteredListAirdrop, setFilteredListAirdrop] = useState<ReceiveItem[]>(
    [],
  )

  const {
    ui: { width },
  } = useUI()
  const { fetchAirdropStatus } = useStatus()

  const isMobile = width < 768

  const loading = useMemo(
    () => (listReceived === undefined ? true : false),
    [listReceived],
  )

  const filterAirdrops = useCallback(async () => {
    if (!listReceived) return
    const receiveList = Object.values(listReceived)

    if (!receiveList.length) return setListAirdrop([])
    let nextAirdrops: ReceiveItem[] = []
    const readyList: ReceiveItem[] = []
    const otherList: ReceiveItem[] = []
    for (const airdrop of receiveList) {
      const { receiptAddress, distributorAddress, recipientData } = airdrop
      const { startedAt } = recipientData
      const status = await fetchAirdropStatus({
        distributor: distributorAddress,
        receipt: receiptAddress,
        startedAt: startedAt.toNumber(),
      })
      if (status === State.ready) {
        readyList.push(airdrop)
        continue
      }
      otherList.push(airdrop)
    }
    readyList.sort(
      (a, b) =>
        Number(b.recipientData.startedAt) - Number(a.recipientData.startedAt),
    )
    nextAirdrops = readyList.concat(otherList)
    return setListAirdrop(nextAirdrops)
  }, [fetchAirdropStatus, listReceived])

  useEffect(() => {
    filterAirdrops()
  }, [filterAirdrops])

  return (
    <Card loading={loading} className="card-lightning">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Row>
            <Col flex="auto">
              <Typography.Title level={5}>Airdrop receive</Typography.Title>
            </Col>
            <Col>
              <Space>
                <LoadMetadata />
                <FilterReceiveList
                  listReceive={listAirdrop}
                  onFilter={setFilteredListAirdrop}
                />
              </Space>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          {isMobile ? (
            <ListReceiveMobile
              listReceive={filteredListAirdrop.slice(0, amountAirdrop)}
            />
          ) : (
            <Table
              dataSource={filteredListAirdrop.slice(0, amountAirdrop)}
              pagination={false}
              columns={COLUMNS_RECEIVE}
              rowKey={(record) => record.receiptAddress}
            />
          )}
        </Col>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Button
            onClick={() => setAmountAirdrop(amountAirdrop + DEFAULT_AMOUNT)}
            type="ghost"
            icon={<IonIcon name="arrow-down-outline" />}
            disabled={amountAirdrop >= filteredListAirdrop.length}
          >
            VIEW MORE
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

export default AirdropReceive
