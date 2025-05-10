import { Button } from '@heroui/react'
import styled from '@emotion/styled'
import { PiHouseFill, PiListPlusFill, PiGearFill } from 'react-icons/pi'
import { useRouter } from 'next/router'

// @ts-expect-error 暫時忽略，不影響功能
import tailwindConfig from '../../../tailwind.config' // 根據你的路徑調整

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
    padding: 8px 18px;
    transition: all 200ms;
    display: inline-block;
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
    width: 0%;
    height: 2px;
    border-radius: 5px;
    position: relative;
    left: 50%;
    top: 20px;
    background: var(--col-orange);
    transition: all 200ms;
  }
  .label > svg {
    transition: 300ms;
    fill: var(--col-darkGray);
    margin-top: 0;
  }
  .label:has(input:checked) > svg {
    fill: var(--col-orange);
    scale: 1.2;
    margin-top: -5px;
  }

  .label:has(input:checked)::before {
    width: 100%;
    left: 0;
    top: 25px;
  }
`

export default function NavBar() {
  const router = useRouter()
  const isHome = router.pathname === '/'
  const isSettings = router.pathname === '/settings'

  return (
    <div className="navbar h-[72px] flex w-full gap-4  p-4 justify-center">
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
          <Button
            className="bg-gray-600/75 text-white"
            isIconOnly
            style={{ transform: 'scale(1.2)' }}
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
