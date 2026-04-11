import { Button } from '@heroui/react'
import styled from '@emotion/styled'
import {
  PiHouseFill,
  PiListPlusFill,
  PiGearFill,
  PiArrowsLeftRight,
} from 'react-icons/pi'
import { useRouter } from 'next/router'
// @ts-expect-error 暫時忽略，不影響功能
import tailwindConfig from '../../../tailwind.config' // 根據你的路徑調整
import { useAccountBookStore } from '@/stores/accountBook'

const resolvedConfig = require('tailwindcss/resolveConfig')
const themeConfig = resolvedConfig(tailwindConfig)

const StyledWrapper = styled.div`
  section {
    --col-orange: ${themeConfig.theme.colors.orange[400]};
    --col-dark: #0c0f14;
    --col-darkGray: #52555a;
    --col-gray: #aeaeae;

    width: fit-content;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    background-color: var(--col-dark);
    border-radius: 30px;
  }
  .label {
    padding: 8px 4px;
    transition: all 200ms;
    display: inline-block;
    position: relative;
  }

  .label input[type='radio'] {
    display: none;
  }
  .label > svg {
    transition: all 200ms;
    fill: var(--col-gray);
    width: 42px;
  }
  .label:hover:not(:has(input:checked)) > svg {
    fill: var(--col-orange);
    opacity: 0.6;
  }
  .label::before {
    content: '';
    display: block;
    width: 20px;
    height: 2px;
    border-radius: 2px;
    position: absolute;
    left: 50%;
    bottom: 4px;
    transform: translateX(-50%) scaleX(0);
    background: var(--col-orange);
    transition: transform 200ms ease;
    transform-origin: center;
  }
  .label > svg {
    transition: 300ms;
    fill: var(--col-darkGray);
    margin-top: 0;
  }
  .label:has(input:checked) > svg {
    fill: var(--col-orange);
    scale: 1.2;
    margin-top: 0;
  }

  .label:has(input:checked)::before {
    transform: translateX(-50%) scaleX(1);
  }
`

export default function NavBar() {
  const router = useRouter()
  const isSettlement = router.pathname.includes('/settlement')
  const isHome =
    router.pathname === '/' ||
    (router.pathname.startsWith('/account-books') && !isSettlement)
  const isSettings = router.pathname.startsWith('/settings')

  const currentAccountBookId = useAccountBookStore(
    (state) => state.currentAccountBookId
  )
  const accountBookId =
    (typeof router.query.id === 'string' ? router.query.id : null) ??
    currentAccountBookId

  function handleAddTransaction() {
    if (!accountBookId) {
      return
    }

    void router.push(`/account-books/${accountBookId}?modal=create`)
  }

  return (
    <div className="navbar h-[72px] flex w-full p-4 justify-center items-center">
      <StyledWrapper>
        <section>
          <label title="home" htmlFor="home" className="label">
            <input
              id="home"
              name="page"
              type="radio"
              checked={isHome}
              onChange={() => router.push('/')}
            />
            <PiHouseFill></PiHouseFill>
          </label>
          <label title="settlement" htmlFor="settlement" className="label">
            <input
              id="settlement"
              name="page"
              type="radio"
              checked={isSettlement}
              onChange={() => {
                if (accountBookId) {
                  void router.push(`/account-books/${accountBookId}/settlement`)
                }
              }}
            />
            <PiArrowsLeftRight></PiArrowsLeftRight>
          </label>
          <Button
            className="bg-gray-600/75 text-white mx-2 "
            isIconOnly
            style={{ transform: 'scale(1.2)' }}
            onPress={handleAddTransaction}
          >
            <PiListPlusFill size={28}></PiListPlusFill>
          </Button>
          <label title="settings" htmlFor="settings" className="label">
            <input
              id="settings"
              name="page"
              type="radio"
              checked={isSettings}
              onChange={() => router.push('/settings')}
            />
            <PiGearFill></PiGearFill>
          </label>
        </section>
      </StyledWrapper>
    </div>
  )
}
