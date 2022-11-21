import React from "react";

function Footer(){
    return(
        <div className="py-5 text-center">
            <div className="container max-w-screen-lg mx-auto">
					<div>
						<div className="flex flex-wrap justify-center gap-2">
							<a 
								href="https://twitter.com/NuggetsLess"
								className="bg-stone-400 p-2 font-semibold text-white inline-flex items-center space-x-2 rounded-full"
								target="_blank">
								<svg
									className="w-5 h-5 fill-current"
									role="img"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
								>
									<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
								</svg>
							</a>
							<a 
								href="https://github.com/ArianDervishaj"
								className="bg-stone-400 p-2 font-semibold text-white inline-flex items-center space-x-2 rounded-full"
								target="_blank">
								<svg
								xmlns="http://www.w3.org/2000/svg"
								xmlnsXlink="http://www.w3.org/1999/xlink"
								aria-hidden="true"
								role="img"
								className="w-5"
								preserveAspectRatio="xMidYMid meet"
								viewBox="0 0 24 24"
								>
								<g fill="none">
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
										fill="currentColor"
									/>
								</g>
								</svg>
							</a>
						</div>
					</div>
				</div>
            <p className="text-sm mt-2 opacity-50">
                Arian Dervishaj
            </p>
        </div>
    )
}

export default Footer;