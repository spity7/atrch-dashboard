import { useEffect, useState } from 'react'
import { Card, CardBody, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PageBreadcrumb from '@/components/layout/PageBreadcrumb'
import PageMetaData from '@/components/PageTitle'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useGlobalContext } from '@/context/useGlobalContext'
import HandizListTable from './components/HandizListTable'

const Handiz = () => {
  const { getAllHandiz } = useGlobalContext()
  const [handizList, setHandizList] = useState([])

  useEffect(() => {
    const fetchHandiz = async () => {
      try {
        const data = await getAllHandiz()
        setHandizList(data)
      } catch (error) {
        console.error('Error fetching handiz:', error)
      }
    }
    fetchHandiz()
  }, [getAllHandiz])

  return (
    <>
      <PageMetaData title="Handiz List" />
      <PageBreadcrumb title="Handiz List" subName="Atrch" />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="d-flex flex-wrap justify-content-between gap-3">
                {/* <div className="search-bar">
                  <span>
                    <IconifyIcon icon="bx:search-alt" className="mb-1" />
                  </span>
                  <input type="search" className="form-control" id="search" placeholder="Search ..." />
                </div> */}
                <div>
                  <Link to="/ecommerce/handiz/create" className="btn btn-primary d-flex align-items-center">
                    <IconifyIcon icon="bx:plus" className="me-1" />
                    Create Handiz
                  </Link>
                </div>
              </div>
            </CardBody>
            <div>{handizList.length > 0 ? <HandizListTable handiz={handizList} /> : <div className="text-center p-4">No handiz found</div>}</div>
          </Card>
        </Col>
      </Row>
    </>
  )
}
export default Handiz
